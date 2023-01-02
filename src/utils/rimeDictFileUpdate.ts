import { writeFile } from "fs/promises";
import readFileUtf8 from "read-file-utf8";
import { SemVer } from "semver";
import chalk from "chalk";
export default async function rimeDictFileUpdate(
  dictYamlPath: string,
  dictContent: string
) {
  const dictContentUpdate = (rawYaml: string) =>
    rawYaml.replace(/\.\.\.[\s\S]*$/, `...\n\n${dictContent}\n`);
  const dictVersionPatch = (replacedYaml: string) =>
    replacedYaml.replace(/(?<=version: "?).*?(?="?)$/, versionPatch);
  {
    const rawYaml = await read(dictYamlPath);
    const replacedYaml = dictContentUpdate(rawYaml);
    const contentChanged = replacedYaml !== rawYaml;
    const versionBumpedYaml = contentChanged
      ? dictVersionPatch(replacedYaml)
      : replacedYaml;
    await writeFile(dictYamlPath, versionBumpedYaml);
    console.log(chalk.blue(dictYamlPath) + " dict content updated");
  }
}
function versionPatch(version: any) {
  return new SemVer(version).inc("patch").version;
}
async function read(dictYamlPath: string) {
  return await readFileUtf8(dictYamlPath);
}
