#!/usr/bin/env node
import aswitcher from "aswitcher";
import path from "path";
import { packageDirectory } from "pkg-dir";
import workPackageDir from "work-package-dir";
import snorun from "snorun";

// TODO
{
  main();
}
async function main() {
  await workPackageDir();
  const [node, js, ...argv] = process.argv;
  const pkgdir = await packageDirectory({ cwd: path.parse(js).dir });
  if (!pkgdir)
    throw new Error(
      "package not found, please contact snomiao@gmail.com to report this bug"
    );
  process.chdir(pkgdir);
  await aswitcher(process.platform, {
    aix: async () => notSupportedYet(),
    android: async () => notSupportedYet(),
    cygwin: async () => notSupportedYet(),
    darwin: async () => {
      console.log({ pkgdir, cwd: process.cwd() });
      (await snorun("cp -r ./node_modules/rime-snomiao/Rime/* ~/Library/Rime || cp -r ./* ~/Library/Rime"))
        ? console.log("go to your task bar, find <deploy> button and click.")
        : await notSupportedYet();
    },
    freebsd: async () => notSupportedYet(),
    haiku: async () => notSupportedYet(),
    linux: async () => notSupportedYet(),
    netbsd: async () => notSupportedYet(),
    openbsd: async () => notSupportedYet(),
    sunos: async () => notSupportedYet(),
    win32: async () => {
      console.log({ pkgdir, cwd: process.cwd() });
      await snorun("install")},
  });
  async function notSupportedYet() {
    console.log("[rime-snomiao] auto install not supported yet");
    console.log(`[rime-snomiao] plz copy from this folder ${`${pkgdir}/Rime`}`);
    console.log(`[rime-snomiao] to your Rime user configuration directory`);
 }
}
