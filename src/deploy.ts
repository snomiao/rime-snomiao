import snorun from "snorun";
import workPackageDir from "./lib/workPackageDir";

export async function deploy() {
  await workPackageDir();
  await snorun("cd tools && deploy");
}
