import chalk from "chalk";
import { writeFile } from "fs/promises";
import readFileUtf8 from "read-file-utf8";
import { SemVer } from "semver";
export default async function rimeDictFileUpdate(f: string, content: string) {
  const y0 = await readFileUtf8(f);

  const versionReg = /(?<=^\s*version: ["']).*?(?=["']$)/im;
  const version = y0.match(versionReg)?.[0];
  if (!version) throw new Error("Invalid yaml version");

  const y1 = yamlDictContentUpdate(y0, content);
  if (y0 !== y1) {
    const patchedVersion = new SemVer(version).inc("patch").version;
    const patchedContent = y1.replace(versionReg, () => patchedVersion);

    await writeFile(f, patchedContent);
    console.log(
      chalk.blue(f) + ` dict content updated ${version} => ${patchedVersion}`
    );
  } else {
    console.log(chalk.blue(f) + " dict content has not changed.");
  }
}

export function yamlDictContentUpdate(y: string, content: string) {
  return y.replace(/\.\.\.[\s\S]*$/, `...\n\n${content}\n`);
}
