import esMain from "es-main";
import { writeFile } from "fs/promises";
import { globby } from "globby";
import { map, pipe, sortBy } from "rambda";
import readFileUtf8 from "read-file-utf8";
import workPackageDir from "work-package-dir";
import { yamlVersionPatch } from "../utils/rimeDictFileUpdate";

if (esMain(import.meta)) await index();

export default async function index() {
  await workPackageDir();
  const csvs = await globby("dict/wubi/*.csv");
  const freqs = await globby("dict/wubi/*.txt");
  const freq = new Map<string, number>(
    (await readFileUtf8(freqs[0]))
      .replace(/[\uFEFF\r]/g, "")
      .split("\n")
      .map(l => {
        const [w, f] = l.split("\t");
        return [w, -Number(f)] as const;
      })
  );
  const ww = (await readFileUtf8(csvs[0]))
    .replace(/[\uFEFF\r]/g, "")
    .split("\n")
    .flatMap(l => {
      const [code, ...words] = l.split(",");
      return words.map(word => [code, word] as const);
    });
  const lpc = new Map(
    pipe(
      () => ww,
      sortBy(([code, w]) => -code.length),
      map(([c, w]) => [w, c] as const)
    )()
  );
  const dictContent = pipe(
    () => ww,
    map(([code, word]) => [word, code, freq.get(word) || 0] as const),
    sortBy(([, , freq]) => -freq),
    map(([word, code, freq]) =>
      word.length <= 2
        ? [word, code, freq]
        : [
            word,
            word
              .split("")
              .map(char => lpc.get(char)?.slice(0, 2) || "zz")
              .join(""),
            freq,
          ]
    ),
    map(r => r.join("\t")),
    e => e.join("\n")
  )();
  const f = "Rime/sno_wubi.dict.yaml";
  const cont = await readFileUtf8(f);
  await writeFile(
    f,
    yamlVersionPatch(cont.replace(/(?<=\n\.\.\.\n)(?:.*\n?)+/, dictContent))
  );
  console.log(f);
}
