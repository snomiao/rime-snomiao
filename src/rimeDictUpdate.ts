import rimeDictFileUpdate from "./rimeDictFileUpdate";

export async function rimeDictUpdate(dictName: string, dictArrays: string[][]) {
  await rimeDictFileUpdate(
    "Rime/" + dictName + ".dict.yaml",
    dictArrays.map((e) => e.join("\t")).join("\n")
  );
}
