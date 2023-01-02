import path from "path";
import { packageDirectory } from "pkg-dir";
export default async function workPackageDir() {
  const jsdir = path.parse(process.argv[1]).dir;
  const workdir = await packageDirectory({ cwd: jsdir });
  if (!workdir) throw new Error("Error: pkg not found");
  process.chdir(workdir);
  console.log({ workdir });
}
