import rimeDictFileUpdate from "./rimeDictFileUpdate";
export async function rimeDictArrayUpdate(
  dictName: string,
  dictArrays: string[][]
) {
  await rimeDictFileUpdate(
    "Rime/" + dictName + ".dict.yaml",
    dictArrays.map(e => e.join("\t")).join("\n")
  );
}

export async function rimeDictUpdate(dictName: string, content: string) {
  // await rimeDictFileUpdate("Rime/" + dictName + ".dict.yaml", content);
  await rimeDictFileUpdate("Rime/" + dictName + ".dict.yaml", content);
}
