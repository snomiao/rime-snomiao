import path from "path";

export function workdirFix() {
  const workdir = path.parse(process.argv[1]).dir;
  process.chdir(workdir);
  console.log({ workdir });
}
