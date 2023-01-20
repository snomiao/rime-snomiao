import snorun from "snorun";
import aswitcher from "aswitcher";
import { pick, prop } from "rambda";
// TODO
await aswitcher(process.platform, {
  aix: async () => console.log("auto install not supported"),
  android: async () => console.log("auto install not supported"),
  cygwin: async () => console.log("auto install not supported"),
  darwin: async () => {
    await snorun("cp -r rime-snomiao/Rime/* ~/Library/Rime");
    console.log("go to your task bar, find <deploy> button and click.");
  },
  freebsd: async () => console.log("auto install not supported"),
  haiku: async () => console.log("auto install not supported"),
  linux: async () => console.log("auto install not supported"),
  netbsd: async () => console.log("auto install not supported"),
  openbsd: async () => console.log("auto install not supported"),
  sunos: async () => console.log("auto install not supported"),
  win32: async () => await snorun("cd tools && install"),
  //() => console.log("not supported"),
});
