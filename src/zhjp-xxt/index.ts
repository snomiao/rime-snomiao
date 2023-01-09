import chalk from "chalk";
import esMain from "es-main";
import { writeFile } from "fs/promises";
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
        // deploy
      })
      .catch(console.error);
  }
}

async function dictLoad() {
  const mdx = new MDictTypescript("dict/《小学馆V2中日辞典》.mdx");
  const words = mdx.keyList.map(({ keyText }) => keyText);
  const pairs = words.map((word) => [word, mdx.lookup(word).definition]);
  return pairs;
}

export async function parse(pairs: string[][]) {
  console.log(chalk.bgWhite("====================================="));
  let k = 100;
  const zhjpWordCC = pipe(
    () => pairs,
    // sortBy(Math.random),
    // (e) => e.slice(0, 100),
    filter(([k, v]) => Boolean(v)),
    filter(([word, v]) => !word.match(/[\s]/)),
    map(([word, definition]) => {
      const text = definitionTextWash(definition);
      return { word, text, definition };
    }),
    sortBy(({ text }) => -text.length),
    (e) =>
      flatMap(e, ({ word, text, definition }) => {
        const jpWords = jpWordsMatch(text, word);
        if (!jpWords.length) return [];
        // console.log(chalk.red(jpWords.map((e) => `> ${e}`).join("\n")));
        // console.log(chalk.blue(definition));
        // exceptions checking
        if (k-- > 0 ) {
          console.log(chalk.bgBlue(word));
          // console.log(chalk.bgYellow(definition));
          console.log(chalk.red(text));
          console.log(chalk.blue(definition));
          console.log(
            chalk.green(jpWords.join("\n").replace(/^.+/gm, (e) => "> " + e))
          );
          console.log("");
        }
        return [`${word}	${[word, ...jpWords].join(" ")}`];
      }),
    sortBy((e) => -e.length),
    (e) => e.join("\r\n")
  )();
  await writeFile("Rime/opencc/zhjp_word.txt", zhjpWordCC);
  // console.log(sample.slice(0, 1000));
}

function jpWordsMatch(text: string, word: string) {
  const jpWords = (text.match(/.+?．|.+/g) || [])
    .filter(Boolean)
    // remove chinese explanations
    .map((e) => e)
    .map((e) => e)
    // remove quote and chars
    .map((e) => e.replace(/．/gm, ""))
    .flatMap((e) =>
      [...e.matchAll(/(?:(?:.+),)?(.+?)(?:;|$)|(.+)/g)].map((e) => e[1] || e[2])
    )
    .map((e) => e.replace(/^................+/gm, "")) // no more than 20 chars
    // dont only suru, dont tomo
    .map((e) => e.trim())
    .filter(Boolean)
    .filter((e) => e !== `${word}する`)
    .filter((e) => !e.match(/とも$/));
  return jpWords;
}

function definitionTextWash(definition: string) {
  return (
    definition
      // chars
      .replace(/[\x00\r]/gm, "")
      .replace(/[,;.-]/gm, "")
      // chinese explanations
      .replace(/^.*?【補足】.*(?:\n.*)*/gm, "")
      .replace(/^.*?【比較】.*(?:\n.*)*/gm, "")
      .replace(/^.*?【用法】.*(?:\n.*)*/gm, "")
      .replace(/^.*?【.+】.*/gm, "")
      .replace(/^.*?“.*?”.*/gm, "")
      .replace(/^.*?～.*\n.*/gm, "")
      .replace(/^.*?＋.*/gm, "")
      .replace(/^.*?☆.*/gm, "")
      .replace(/例：.*\n.*/gm, "")
      // quotes
      .replace(/<font color\s*?=\s*?black\s*?>.*?<\/font>/gm, "")
      .replace(/<.*?>/gm, "") // html tags
      .replace(/〈.+?〉/gm, "")
      .replace(/｛.+?｝/gm, "")
      .replace(/〔.+?〕/gm, "")
      .replace(/^‐/gm, "")
      .replace(/［.*?］/gm, "")
      .replace(/^[１-８]+/gm, "")
      .replace(/（\d+?）/gm, "")
      .replace(/\(\d+\)/gm, "")
      .replace(/（[^（]+?）/gm, "")
      .replace(/（[^（]+?）/gm, "")
      .replace(/[（(].+[)）]/gm, "")
      // pinyin line
      .replace(/.*?[a-z].*/gm, "")
      .replace(/\n(?:\s*\n)+/gm, "\n")
      .trim()
  );
}
