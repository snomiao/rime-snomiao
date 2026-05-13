#!/usr/bin/env node
import { execSync } from "child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { cp, mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const VERBOSE = process.argv.includes("--verbose") || process.argv.includes("-v");
const HOME = os.homedir();
const tilde = (p: string) => (p === HOME || p.startsWith(HOME + path.sep) ? "~" + p.slice(HOME.length) : p);

main().catch((e: Error) => {
  console.error(`✗ ${e.message}`);
  process.exit(1);
});

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const pkgdir = path.resolve(__dirname, "..");
  const rimeDir = path.join(pkgdir, "Rime");
  const pkg = JSON.parse(readFileSync(path.join(pkgdir, "package.json"), "utf8")) as { version: string };

  const platformLabel: Record<string, string> = {
    darwin: "macOS / Squirrel",
    win32: "Windows / Weasel",
    linux: "Linux",
  };
  console.log(`rime-snomiao ${pkg.version} → ${platformLabel[process.platform] ?? process.platform}`);

  switch (process.platform) {
    case "win32":  return setupWindows(rimeDir);
    case "darwin": return setupMacOS(rimeDir);
    case "linux":  return setupLinux(rimeDir);
    default:       return notSupportedYet(rimeDir);
  }
}

// ─── Windows (Weasel 小狼毫) ─────────────────────────────────────────────────

async function setupWindows(rimeDir: string) {
  let weaselDir = findWeaselDir();
  if (!weaselDir) {
    console.log("→ Weasel not detected — downloading installer…");
    await downloadAndInstallWeasel();
    weaselDir = findWeaselDir();
    if (!weaselDir) {
      console.log("→ Re-run this command once the Weasel installer finishes.");
      return;
    }
  } else {
    console.log(`→ Weasel detected at ${weaselDir}`);
  }

  const rimeDest = path.join(process.env["APPDATA"]!, "Rime");
  await mkdir(rimeDest, { recursive: true });
  run(`robocopy "${rimeDir}" "${rimeDest}" /E /XD node_modules`, { allowExitCodes: [0, 1] });
  const { count, bytes } = summarizeDir(rimeDir);
  console.log(`→ Copied ${count} files (${formatBytes(bytes)}) → ${rimeDest}`);

  run(`"${path.join(weaselDir, "WeaselServer.exe")}" /install`);
  const deployer = path.join(weaselDir, "WeaselDeployer.exe");
  if (existsSync(deployer)) tryRun(`"${deployer}" /deploy`);

  console.log("");
  console.log("Done. Right-click 小狼毫 in the system tray → 用户文件夹 / Schema list to pick a schema.");
}

async function downloadAndInstallWeasel() {
  const res = await fetch("https://api.github.com/repos/rime/weasel/releases/latest", {
    headers: { "User-Agent": "rime-snomiao" },
  });
  const release = (await res.json()) as any;
  const asset = release.assets?.find((a: any) => /weasel.*installer\.exe$/i.test(a.name));
  if (!asset) throw new Error("No Weasel installer found in latest release");

  const dest = path.join(os.tmpdir(), asset.name);
  if (!existsSync(dest)) {
    console.log(`  downloading ${asset.name}…`);
    const fileRes = await fetch(asset.browser_download_url);
    await writeFile(dest, Buffer.from(await fileRes.arrayBuffer()));
  }
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

  if (!existsSync(squirrelApp)) {
    console.log("→ Installing Squirrel…");
    await installSquirrel();
  }
  const v = squirrelVersion(squirrelApp);
  if (v) console.log(`→ Squirrel ${v} ready`);

  const rimeDest = path.join(HOME, "Library", "Rime");
  await mkdir(rimeDest, { recursive: true });
  await cp(rimeDir, rimeDest, { recursive: true, force: true });
  const { count, bytes } = summarizeDir(rimeDir);
  console.log(`→ Copied ${count} files (${formatBytes(bytes)}) → ${tilde(rimeDest)}`);

  const squirrelBin = path.join(squirrelApp, "Contents/MacOS/Squirrel");
  if (existsSync(squirrelBin)) {
    run(`"${squirrelBin}" --reload`);
    console.log("→ Squirrel reloaded");
  }

  // macOS 13+ uses the Keyboard-Settings extension URL; older releases use the legacy pref pane URL.
  const modern = "x-apple.systempreferences:com.apple.Keyboard-Settings.extension?InputSources";
  const legacy = "x-apple.systempreferences:com.apple.preference.keyboard?InputSources";
  if (tryRun(`open "${modern}"`) || tryRun(`open "${legacy}"`)) {
    console.log("→ Opened System Settings → Keyboard → Input Sources");
  }

  console.log("");
  console.log("Done. Click  Edit…  →  +  →  Chinese, Simplified  →  Squirrel  to enable.");
}

function squirrelVersion(app: string): string | null {
  try {
    return execSync(`/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" "${app}/Contents/Info.plist"`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

async function installSquirrel() {
  if (commandExists("brew")) {
    run("brew install --cask squirrel-app");
    return;
  }

  console.log("  Homebrew not found, downloading Squirrel .pkg…");
  const res = await fetch("https://api.github.com/repos/rime/squirrel/releases/latest", {
    headers: { "User-Agent": "rime-snomiao" },
  });
  const release = (await res.json()) as any;
  const asset = release.assets?.find((a: any) => a.name.endsWith(".pkg"));
  if (!asset) throw new Error("No Squirrel .pkg installer found in latest release");

  const dest = path.join(os.tmpdir(), asset.name);
  if (!existsSync(dest)) {
    const fileRes = await fetch(asset.browser_download_url);
    await writeFile(dest, Buffer.from(await fileRes.arrayBuffer()));
  }
  run(`sudo installer -pkg "${dest}" -target /`);
}

// ─── Linux (ibus-rime / fcitx5-rime) ─────────────────────────────────────────

async function setupLinux(rimeDir: string) {
  let frontend = detectLinuxFrontend();
  if (!frontend) {
    console.log("→ No Rime frontend found — installing…");
    installLinuxRime();
    frontend = detectLinuxFrontend();
    if (!frontend)
      throw new Error(
        "Could not detect ibus or fcitx5 after install.\n" +
          "Please install ibus-rime or fcitx5-rime manually, then re-run."
      );
  }

  const { name, configDir } = frontend;
  console.log(`→ Using ${name}`);

  await mkdir(configDir, { recursive: true });
  await cp(rimeDir, configDir, { recursive: true, force: true });
  const { count, bytes } = summarizeDir(rimeDir);
  console.log(`→ Copied ${count} files (${formatBytes(bytes)}) → ${tilde(configDir)}`);

  if (commandExists("rime_deployer")) {
    run(`rime_deployer --build "${configDir}"`);
  } else if (name.startsWith("fcitx5") && commandExists("fcitx5-remote")) {
    run("fcitx5-remote -r");
  } else if (commandExists("ibus-daemon")) {
    run("ibus-daemon --replace --daemonize");
  }

  console.log("");
  console.log(`Done. Open your IME settings (${name.startsWith("fcitx5") ? "fcitx5-config-qt" : "ibus-setup"}) and add Rime as an input source.`);
}

function detectLinuxFrontend(): { name: string; configDir: string } | null {
  const home = os.homedir();
  const candidates = [
    { name: "fcitx5-rime", binary: "fcitx5",     configDir: path.join(home, ".local/share/fcitx5/rime") },
    { name: "ibus-rime",   binary: "ibus-setup", configDir: path.join(home, ".config/ibus/rime") },
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

function summarizeDir(dir: string): { count: number; bytes: number } {
  let count = 0;
  let bytes = 0;
  const walk = (p: string) => {
    for (const entry of readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        count++;
        bytes += statSync(full).size;
      }
    }
  };
  walk(dir);
  return { count, bytes };
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function run(cmd: string, opts: { allowExitCodes?: number[] } = {}) {
  if (VERBOSE) console.log(`  $ ${cmd}`);
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
  console.log("→ Auto install not supported on this platform yet.");
  console.log(`→ Copy ${rimeDir} to your Rime config directory manually.`);
}
