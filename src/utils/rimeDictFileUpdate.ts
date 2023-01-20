import chalk from "chalk";
import { writeFile } from "fs/promises";
import readFileUtf8 from "read-file-utf8";
import { SemVer } from "semver";
export default async function rimeDictFileUpdate(f: string, content: string) {
  const y0 = await readFileUtf8(f);
  const y1 = yamlDictContentUpdate(y0);
  await writeFile(f, y0 !== y1 ? yamlVersionPatch(y1) : y1);
  console.log(chalk.blue(f) + " dict content updated");
}

export function yamlDictContentUpdate(y: string) {
  return y.replace(/\.\.\.[\s\S]*$/, `...\n\n\n`);
}
export function yamlVersionPatch(y: string) {
  return y.replace(
    /(?<=version: "?).*?(?="?)$/,
    v => new SemVer(v).inc("patch").version
  );
}
