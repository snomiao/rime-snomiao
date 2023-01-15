import chalk from "chalk";
import esMain from "es-main";
import { writeFile } from "fs/promises";
import { globby } from "globby";
import { flatMap } from "lodash-es";
import { filter, map, pipe, sortBy, uniq } from "rambda";
import snohmr from "snohmr";
import workPackageDir from "work-package-dir";
import MDictTypescript from "../lib/mdictTypescript";
import { format } from "prettier";
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
  let k = 10;
  const zhjpWordCC = pipe(
    () => pairs,
    sortBy(Math.random),
    // (e) => e.slice(0, 100),
    filter(([k, v]) => Boolean(v)),
    filter(([word, v]) => !word.match(/[\s]/)),
    map(([word, definition]) => {
      const text = definitionTextWash(definition);
      return { word, text, definition };
    }),
    sortBy(({ text }) => text.length),
    (e) =>
      flatMap(e, ({ word, text, definition }) => {
        const enPharses = wordsMatch(text, word);
        if (!enPharses.length) return [];
        const zhWord = word.replace(/，/g, "");
        const enWords = uniq(enPharses)
          .map((phrase) => phrase.replace(/^to /g, ""))
          .map((e) => e.trim())
          .map((e) => e.replace(/ /g, "\u00A0"));
        if ((text && k) || word === "和") {
          k && k--;
          console.log(chalk.bgBlue(word));
          console.log(chalk.blue(format(definition, { parser: "html" })));
          console.log(chalk.red(text));
          console.log(
            chalk.green(enWords.join("\n").replace(/^.+/gm, (e) => `> ${e}.`))
          );
          console.log("");
        }
        return [
          `${zhWord}	${[
            // word,
            ...enWords.map((w) => `${w}\u00A0`),
          ].join(" ")}`,
        ];
      }),
    // sortBy((e) => -e.length),
    (e) => e.join("\n")
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
      // quotes
      // link
      .replace(/^@@@LINK=.*(?:\n.*)*/gm, "")
      // mark
      .replace(/<dt>(.*?)<\/dt>/gm, (_, $1) => $1 + "\n")
      .replace(/<div class="py2?">.*?<\/div>/gm, "")
      .replace(/<a href="entry:\/\/(.*?)">.*?<\/a>/gm, (_, $1) => `〔${$1}〕`)
      .replace(/<span class="hpy">.*?<\/span>/gm, "")
      // quotes
      .replace(/<.*?>/gm, "") // html tags
      .replace(/\(.*?\)/gm, "")
      .replace(/【.*】/gm, "")
      .replace(/^(?:lit|fig)\./gm, "")
      .replace(/^Taiwan pr\..*/gm, "")
      .replace(/[;.-]/gm, "")
      .replace(/ 〔/gm, "〔")
      .replace(/  +/gm, " ")
      .trim()
  );
}
