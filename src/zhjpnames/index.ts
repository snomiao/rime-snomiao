// - [日本人名地名平假名汉字双向词典](https://mdict.org/post/riben-renming-diming/)

import { csvParse } from "d3";
import esMain from "es-main";
import { globby } from "globby";
import readFileUtf8 from "read-file-utf8";
import snohmr from "snohmr";
import workPackageDir from "work-package-dir";

if (esMain(import.meta)) await index();

export default async function index() {
  await workPackageDir();
  const csvs = await globby("src/wubi86/*.csv");
  const freqs = await globby("src/wubi86/*.txt");
  const freq = new Map(
    (await readFileUtf8(freqs[0]))
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => {
        const [w, f] = l.split("\t");
        return [w, f];
      })
  );
  const ww = (await readFileUtf8(csvs[0]))
    .replace(/\r/g, "")
    .split("\n")
    .flatMap((l) => {
      const [code, ...words] = l.split(",");
      return words.map((word) => [code, word]);
    });
  const dictContent = ww
    .map(([code, word]) => {
      return [word, code, freq.get(word)].join("\t");
    })
    .join("\n");
  console.log(dictContent);
}
