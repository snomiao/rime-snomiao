import path from "path";
import Mdict from "./mdictFix";
import snohmr from "snohmr";
import workdirFix from "./workdirFix";
import chalk from "chalk";
{
  await workdirFix();
  const mdx = new Mdict("dict/三省堂超级大辞林第二版.mdx");
  const words = mdx.keyList.map(({ keyText }) => keyText);
  const engWords = words.filter((e) => e.match(/^[ a-zA-Z]+$/));
  const engWordsSample = engWords.sort(() => Math.random() - 0.5).slice(0, 10);

  const watchedFile = "src/jpDictParse.ts";
  await snohmr<typeof import("./jpDictParse")>(watchedFile, async (m) => {
    if (!m) return;
    const { default: jpDictParse } = m;
    const r = jpDictParse(engWordsSample, mdx)
      .map(
        ({ word, definition, translations }) =>
          [...new Set(translations)].sort().map((t) => [translations, word])
        // [ // debug
        //   // chalk.red(word) + chalk.green(JSON.stringify(definition)),
        //   // chalk.blue(translations.join("\n")),
        // ]
      )
      .flat()
      .join("\n\n");
  });
}
