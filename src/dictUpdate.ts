import { writeFile } from "fs/promises";
import readFileUtf8 from "read-file-utf8";
import { SemVer } from "semver";

export async function dictUpdate(dictYamlPath: string, dictContent: string) {
  const theYaml = await readFileUtf8(dictYamlPath);

  const replacedYaml = theYaml.replace(
    /\.\.\.[\s\S]*$/,
    `...\n\n${dictContent}\n`
  );

  const versionBumpedYaml = replacedYaml === theYaml
    ? replacedYaml
    : replacedYaml.replace(
      /version: "(.*)"/,
      (_, version) => 'version: "' + new SemVer(version).inc("patch").version + '"'
    );

  await writeFile(dictYamlPath, versionBumpedYaml);
  console.log(dictYamlPath + " dict content updated");
}
