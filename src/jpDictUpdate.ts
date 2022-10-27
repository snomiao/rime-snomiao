import Mdict from "mdict-js";
import { dictUpdate } from "./dictUpdate";
import jpDictParse from "./jpDictParse";

export default async function jpDictUpdate(engWords: string[], mdx: Mdict) {
  const r = jpDictParse(engWords.sort(), mdx)
    .map(
      ({ word, definition, translations }) =>
        [...new Set(translations)]
          .sort()
          .map((t) => [t, word].join("\t"))
          .join("\n")
      // [ // debug
      //   // chalk.red(word) + chalk.green(JSON.stringify(definition)),
      //   // chalk.blue(translations.join("\n")),
      // ]
    )
    .flat()
    .join("\n");
  console.log(r);
  await dictUpdate("Rime/translate_en2jp.dict.yaml", r);
}
