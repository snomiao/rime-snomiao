import chalk from "chalk";
import esMain from "es-main";
import { writeFile } from "fs/promises";
import { globby } from "globby";
import { flatMap } from "lodash-es";
import { filter, map, pipe, sortBy } from "rambda";
import snohmr from "snohmr";
import workPackageDir from "work-package-dir";
import MDictTypescript from "../lib/mdictTypescript";

if (esMain(import.meta)) await index();

export default async function index() {
  await workPackageDir();
  const pairs = await dictLoad();
  for await (const { parse } of snohmr(() => import("./index"))) {
    await parse(pairs)
      .then(() => {
        // maybe deploy
      })
      .catch(console.error);
  }
}

async function dictLoad() {
  const files = await globby("dict/CC-CEDICT*/*.mdx");
  if (files.length > 1) throw new Error("mdx file too many");
  if (!files.length) throw new Error("mdx file not found");
  const file = files[0];
  const mdx = new MDictTypescript(file);
  console.log("dict loaded");
  const words = mdx.keyList.map(({ keyText }) => keyText);
  const pairs = words.map((word) => [word, mdx.lookup(word).definition]);
  return pairs;
}

export async function parse(pairs: string[][]) {
  console.log(chalk.bgWhite("====================================="));
  let k = 1000;
  const zhjpWordCC = pipe(
    () => pairs,
    sortBy(Math.random),
    (e) => e.slice(0, 100),
    filter(([k, v]) => Boolean(v)),
    filter(([word, v]) => !word.match(/[\s]/)),
    map(([word, definition]) => {
      const text = definitionTextWash(definition);
      return { word, text, definition };
    }),
    sortBy(({ text }) => -text.length),
    (e) =>
      flatMap(e, ({ word, text, definition }) => {
        const enWords = wordsMatch(text, word);
        if (!enWords.length) return [];
        if (text && k--) {
          console.log(chalk.bgBlue(word));
          console.log(chalk.blue(definition));
          console.log(chalk.red(text));
          console.log(
            chalk.green(enWords.join("\n").replace(/^.+/gm, (e) => "> " + e))
          );
          console.log("");
        }
        return [`${word}	${[word, ...enWords].join(" ")}`];
      }),
    // sortBy((e) => -e.length),
    (e) => e.join("\r\n")
  )();
  await writeFile("Rime/opencc/zhen_word.txt", zhjpWordCC);
  // console.log(sample.slice(0, 1000));
}

function wordsMatch(text: string, word: string) {
  const words = (text.match(/.+/g) || [])
    .map((e) => e.trim())
    .filter(Boolean)

    .map((e) => e.trim())
    .filter(Boolean);
  return words;
}

function definitionTextWash(definition: string) {
  return (
    definition
      // chars
      .replace(/[\x00\r]/gm, "")
      .replace(/[,;.-]/gm, "")
      //
      .replace(/^@@@LINK=.*/gm, "")
      // .replace(/(?<=<\/.*?>)/gm, "\n")
      // mark
      .replace(/<dt>(.*?)<\/dt>/gm, (_, $1) => $1 + "\n")
      .replace(/<div class="py">.*?<\/div>/gm, "")
      // quotes
      .replace(/<.*?>/gm, "") // html tags
      .replace(/\(.*?\)/gm, "") // html tags
      .replace(/【.*】/gm, "")
      .trim()
  );
}
