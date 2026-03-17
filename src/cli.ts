#!/usr/bin/env node
import { execSync } from "child_process";
import { existsSync, readdirSync } from "fs";
import { cp, mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

main().catch((e: Error) => {
  console.error("[rime-snomiao] Error:", e.message);
  process.exit(1);
});

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const pkgdir = path.resolve(__dirname, "..");
  const rimeDir = path.join(pkgdir, "Rime");

  console.log(`[rime-snomiao] platform: ${process.platform}`);
  console.log(`[rime-snomiao] package dir: ${pkgdir}`);

  switch (process.platform) {
    case "win32":  return setupWindows(rimeDir);
    case "darwin": return setupMacOS(rimeDir);
    case "linux":  return setupLinux(rimeDir);
    default:       return notSupportedYet(rimeDir);
  }
}

// ─── Windows (Weasel 小狼毫) ─────────────────────────────────────────────────

async function setupWindows(rimeDir: string) {
  // 1. Download and install Weasel if not already present
  if (!findWeaselDir()) {
    await downloadAndInstallWeasel();
    // Give installer time to finish writing files
    if (!findWeaselDir()) {
      console.log("[rime-snomiao] Weasel installation not detected yet — please re-run after installation completes.");
      return;
    }
  } else {
    console.log("[rime-snomiao] Weasel is already installed.");
  }

  // 2. Copy Rime configs to %APPDATA%\Rime
  const rimeDest = path.join(process.env["APPDATA"]!, "Rime");
  await mkdir(rimeDest, { recursive: true });
  // robocopy exit code 1 = files copied OK, 0 = nothing to do — both are success
  run(`robocopy "${rimeDir}" "${rimeDest}" /E /XD node_modules`, { allowExitCodes: [0, 1] });
  console.log(`[rime-snomiao] Configs copied to ${rimeDest}`);

  // 3. Deploy
  const weaselDir = findWeaselDir()!;
  run(`"${path.join(weaselDir, "WeaselServer.exe")}" /install`);
  console.log("[rime-snomiao] Weasel deployed successfully!");
}

async function downloadAndInstallWeasel() {
  console.log("[rime-snomiao] Fetching latest Weasel release...");
  const res = await fetch("https://api.github.com/repos/rime/weasel/releases/latest", {
    headers: { "User-Agent": "rime-snomiao" },
  });
  const release = (await res.json()) as any;
  const asset = release.assets?.find((a: any) => /weasel.*installer\.exe$/i.test(a.name));
  if (!asset) throw new Error("No Weasel installer found in latest release");

  const dest = path.join(os.tmpdir(), asset.name);
  if (!existsSync(dest)) {
    console.log(`[rime-snomiao] Downloading ${asset.name}...`);
    const fileRes = await fetch(asset.browser_download_url);
    await writeFile(dest, Buffer.from(await fileRes.arrayBuffer()));
  }

  console.log("[rime-snomiao] Running Weasel installer (follow the on-screen prompts)...");
  run(`"${dest}"`);
}

function findWeaselDir(): string | null {
  const base = "C:\\Program Files (x86)\\Rime";
  if (!existsSync(base)) return null;
  const dirs = readdirSync(base)
    .filter((d) => d.startsWith("weasel-"))
    .map((d) => path.join(base, d));
  return dirs.find((d) => existsSync(path.join(d, "WeaselServer.exe"))) ?? null;
}

// ─── macOS (Squirrel 鼠鬚管) ─────────────────────────────────────────────────

async function setupMacOS(rimeDir: string) {
  const squirrelApp = "/Library/Input Methods/Squirrel.app";

  // 1. Install Squirrel if missing
  if (!existsSync(squirrelApp)) {
    console.log("[rime-snomiao] Squirrel not found, installing...");
    await installSquirrel();
  } else {
    console.log("[rime-snomiao] Squirrel is already installed.");
  }

  // 2. Copy Rime configs to ~/Library/Rime
  const rimeDest = path.join(os.homedir(), "Library", "Rime");
  await mkdir(rimeDest, { recursive: true });
  await cp(rimeDir, rimeDest, { recursive: true, force: true });
  console.log(`[rime-snomiao] Configs copied to ${rimeDest}`);

  // 3. Deploy
  const squirrelBin = path.join(squirrelApp, "Contents/MacOS/Squirrel");
  if (existsSync(squirrelBin)) {
    run(`"${squirrelBin}" --reload`);
    console.log("[rime-snomiao] Squirrel reloaded!");
  } else {
    console.log("[rime-snomiao] Please click 'Deploy' in the Squirrel menu bar icon.");
  }
}

async function installSquirrel() {
  if (commandExists("brew")) {
    run("brew install --cask squirrel");
    return;
  }

  // Fallback: download .pkg from GitHub
  console.log("[rime-snomiao] Homebrew not found, downloading Squirrel from GitHub...");
  const res = await fetch("https://api.github.com/repos/rime/squirrel/releases/latest", {
    headers: { "User-Agent": "rime-snomiao" },
  });
  const release = (await res.json()) as any;
  const asset = release.assets?.find((a: any) => a.name.endsWith(".pkg"));
  if (!asset) throw new Error("No Squirrel .pkg installer found in latest release");

  const dest = path.join(os.tmpdir(), asset.name);
  if (!existsSync(dest)) {
    console.log(`[rime-snomiao] Downloading ${asset.name}...`);
    const fileRes = await fetch(asset.browser_download_url);
    await writeFile(dest, Buffer.from(await fileRes.arrayBuffer()));
  }

  run(`sudo installer -pkg "${dest}" -target /`);
}

// ─── Linux (ibus-rime / fcitx5-rime) ─────────────────────────────────────────

async function setupLinux(rimeDir: string) {
  // 1. Detect or install a Rime frontend
  let frontend = detectLinuxFrontend();
  if (!frontend) {
    console.log("[rime-snomiao] No Rime frontend found, installing...");
    installLinuxRime();
    frontend = detectLinuxFrontend();
    if (!frontend)
      throw new Error(
        "Could not detect ibus or fcitx5 after install.\n" +
          "Please install ibus-rime or fcitx5-rime manually, then re-run."
      );
  }

  const { name, configDir } = frontend;
  console.log(`[rime-snomiao] Using ${name}, config dir: ${configDir}`);

  // 2. Copy Rime configs
  await mkdir(configDir, { recursive: true });
  await cp(rimeDir, configDir, { recursive: true, force: true });
  console.log(`[rime-snomiao] Configs copied to ${configDir}`);

  // 3. Deploy
  if (commandExists("rime_deployer")) {
    run(`rime_deployer --build "${configDir}"`);
  } else if (name.startsWith("fcitx5") && commandExists("fcitx5-remote")) {
    run("fcitx5-remote -r");
  } else if (commandExists("ibus-daemon")) {
    run("ibus-daemon --replace --daemonize");
  }
  console.log("[rime-snomiao] Done! You may need to re-login or restart your desktop session.");
}

function detectLinuxFrontend(): { name: string; configDir: string } | null {
  const home = os.homedir();
  const candidates = [
    { name: "fcitx5-rime", binary: "fcitx5",     configDir: path.join(home, ".local/share/fcitx5/rime") },
    { name: "ibus-rime",   binary: "ibus-setup",  configDir: path.join(home, ".config/ibus/rime") },
  ];
  return candidates.find((c) => commandExists(c.binary)) ?? null;
}

function installLinuxRime() {
  const pm = ["apt-get", "pacman", "dnf", "zypper"].find(commandExists);
  if (!pm) throw new Error("No recognized package manager found. Please install ibus-rime or fcitx5-rime manually.");

  const cmds: Record<string, string[]> = {
    "apt-get": ["sudo apt-get install -y fcitx5-rime", "sudo apt-get install -y ibus-rime"],
    pacman:    ["sudo pacman -S --noconfirm fcitx5-rime", "sudo pacman -S --noconfirm ibus-rime"],
    dnf:       ["sudo dnf install -y ibus-rime"],
    zypper:    ["sudo zypper install -y ibus-rime"],
  };

  for (const cmd of cmds[pm]!) {
    if (tryRun(cmd)) return;
  }
  throw new Error("Failed to install a Rime frontend. Please install ibus-rime or fcitx5-rime manually.");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function run(cmd: string, opts: { allowExitCodes?: number[] } = {}) {
  console.log(`  $ ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (e: any) {
    if (opts.allowExitCodes?.includes(e.status)) return;
    throw e;
  }
}

function tryRun(cmd: string): boolean {
  try { run(cmd); return true; } catch { return false; }
}

function commandExists(cmd: string): boolean {
  try {
    execSync(process.platform === "win32" ? `where "${cmd}"` : `which "${cmd}"`, { stdio: "ignore" });
    return true;
  } catch { return false; }
}

function notSupportedYet(rimeDir: string) {
  console.log("[rime-snomiao] auto install not supported yet on this platform");
  console.log(`[rime-snomiao] please copy: ${rimeDir} -> your Rime config directory`);
}
