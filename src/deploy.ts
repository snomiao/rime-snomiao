import snorun from "snorun";
import workdirFix from "./workdirFix";

export async function deploy() {
  await workdirFix();
  await snorun("cd tools && deploy");
}
