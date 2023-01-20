import snorun from "snorun";
import aswitcher from "aswitcher";
aswitcher(process.platform, {
  win32: async () => await snorun("cd tools && install"),

  //   "": () => console.log("not supported"),
});
