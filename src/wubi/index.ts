import esMain from "es-main";
import { globby } from "globby";
import { map, pipe, sortBy, uniq } from "rambda";
import readFileUtf8 from "read-file-utf8";
import workPackageDir from "work-package-dir";
import rimeDictFileUpdate from "../utils/rimeDictFileUpdate";

if (esMain(import.meta)) await index();

export default async function index() {
  await workPackageDir();
  const csv = (await globby("src/wubi/*.csv"))[0];
  const freqContent = await readFileUtf8((await globby("src/wubi/*.txt"))[0]);
  const freqm = pipe(
    () => freqContent,
    e => e.replace(/[\uFEFF\r]/g, ""),
    e => e.split("\n"),
    map(l => {
      const [w, freq] = l.split("\t");
      return [w, -Number(freq)] as const;
    }),
    e => new Map<string, number>(e)
  )();
  const ww = (await readFileUtf8(csv))
    .replace(/[\uFEFF\r]/g, "")
    .split("\n")
    .flatMap(l => {
      const [code, ...words] = l.split(",");
      return words.map(word => [code, word] as const);
    });
  const lpc = pipe(
    () => ww,
    sortBy(([code, w]) => code.length),
    map(([c, w]) => [w, c] as const),
    e => new Map(e)
  )();
  console.log(lpc);
  const dictContent = pipe(
    () => ww,
    map(([code, word]) => [word, code, freqm.get(word) || 0] as const),
    sortBy(([, , freq]) => -freq),
    map(([word, code, freq]) =>
      word.length <= 2
        ? [word, code, freq]
        : [
            word,
            word
              .split("")
              .map(char => {
                const charcode = lpc.get(char)?.slice(0, 2);
                console.assert(
                  charcode?.length === 2,
                  "expect charcode.length===2, got " + charcode
                );
                return charcode || "zz";
              })
              .join(""),
            freq,
          ]
    ),
    map(r => r.join("\t")),
    e => uniq(e),
    e => e.join("\n")
  )();
  await rimeDictFileUpdate("Rime/sno_wubi.dict.yaml", dictContent);
}
