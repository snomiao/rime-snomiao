import snorun from "snorun";
import { workdirFix } from "./workdirFix";

export async function deploy() {
    workdirFix();
    await snorun("cd .. && cd tools && install");
}
