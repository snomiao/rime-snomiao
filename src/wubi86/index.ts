import esMain from "es-main";
import { writeFile } from "fs/promises";
import { globby } from "globby";
import readFileUtf8 from "read-file-utf8";
import workPackageDir from "work-package-dir";

if (esMain(import.meta)) await index();

export default async function index() {
  await workPackageDir();
  const csvs = await globby("dict/wubi86/*.csv");
  const freqs = await globby("dict/wubi86/*.txt");
  const freq = new Map(
    (await readFileUtf8(freqs[0]))
      .replace(/[\uFEFF\r]/g, "")
      .split("\n")
      .map(l => {
        const [w, f] = l.split("\t");
        return [w, -Number(f)];
      })
  );
  const ww = (await readFileUtf8(csvs[0]))
    .replace(/[\uFEFF\r]/g, "")
    .split("\n")
    .flatMap(l => {
      const [code, ...words] = l.split(",");
      return words.map(word => [code, word]);
    });
  const dictContent = ww
    .map(([code, word]) => {
      return [word, code, freq.get(word)].join("\t");
    })
    .join("\n");
  const f = "Rime/sno_wubi86.dict.yaml";
  const cont = await readFileUtf8(f);
  await writeFile(f, cont.replace(/(?<=\.\.\.\n)(?:.*\n?)+/, dictContent));
  console.log(f);
}
