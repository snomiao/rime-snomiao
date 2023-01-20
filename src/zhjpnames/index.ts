// - [日本人名地名平假名汉字双向词典](https://mdict.org/post/riben-renming-diming/)

import chalk from "chalk";
import esMain from "es-main";
import { writeFile } from "fs/promises";
import { globby } from "globby";
import { filter, map, pipe, sortBy } from "rambda";
import snohmr from "snohmr";
import workPackageDir from "work-package-dir";
import mdxFileParse from "../lib/mdxFileParse";

if (esMain(import.meta)) await index();

export default async function index() {
  await workPackageDir();
  const entires = await mdxFileParse((await globby("dict/jpnames/*.mdx"))[0]);
  for await (const { parse } of snohmr(() => import("./index"))) {
    await parse(entires)
      .then(() => {
        // deploy
      })
      .catch(console.error);
  }
}

export async function parse(entries: (readonly [string, string])[]) {
  console.log(chalk.bgWhite("====================================="));
  let k = 100;
  const zhjpWordCC = pipe(
    () => entries,
    // sortBy(Math.random),
    e => e.slice(0, 100),
    filter(([k, v]) => Boolean(v)),
    filter(([word, v]) => !word.match(/[\s]/)),
    map(([word, definition]) => {
      const text = definitionTextWash(definition);
      return { word, text, definition };
    }),
    sortBy(({ text }) => -text.length),
    e =>
      e.flatMap(({ word, text, definition }) => {
        const jpWords = jpWordsMatch(text, word);
        if (!jpWords.length) return [];
        // console.log(chalk.red(jpWords.map((e) => `> ${e}`).join("\n")));
        // console.log(chalk.blue(definition));
        // exceptions checking
        if (k > 0) {
          k--;
          console.log(chalk.bgBlue(word));
          // console.log(chalk.bgYellow(definition));
          console.log(chalk.red(text));
          console.log(chalk.blue(definition));
          console.log(
            chalk.green(jpWords.join("\n").replace(/^.+/gm, e => "> " + e))
          );
          console.log("");
        }
        return [`${word}	${[word, ...jpWords].join(" ")}`];
      }),
    sortBy(e => -e.length),
    e => e.join("\n")
  )();
  await writeFile("Rime/opencc/zhjp_names.txt", zhjpWordCC);
  // console.log(sample.slice(0, 1000));
}

function jpWordsMatch(text: string, word: string) {
  const jpWords = (text.match(/.+?．|.+/g) || []).filter(Boolean);
  // // remove chinese explanations
  // .map((e) => e)
  // .map((e) => e)
  // // remove quote and chars
  // .map((e) => e.replace(/．/gm, ""))
  // .flatMap((e) =>
  //   [...e.matchAll(/(?:(?:.+),)?(.+?)(?:;|$)|(.+)/g)].map((e) => e[1] || e[2])
  // )
  // .map((e) => e.replace(/^................+/gm, "")) // no more than 20 chars
  // // dont only suru, dont tomo
  // .map((e) => e.trim())
  // .filter(Boolean)
  // .filter((e) => e !== `${word}する`)
  // .filter((e) => !e.match(/とも$/));
  return jpWords;
}

function definitionTextWash(definition: string) {
  return (
    definition
      // chars
      // .replace(/[,;.-]/gm, "")
      // // chinese explanations
      // .replace(/^.*?【補足】.*(?:\n.*)*/gm, "")
      // .replace(/^.*?【比較】.*(?:\n.*)*/gm, "")
      // .replace(/^.*?【用法】.*(?:\n.*)*/gm, "")
      // .replace(/^.*?【.+】.*/gm, "")
      // .replace(/^.*?“.*?”.*/gm, "")
      // .replace(/^.*?～.*\n.*/gm, "")
      // .replace(/^.*?＋.*/gm, "")
      // .replace(/^.*?☆.*/gm, "")
      // .replace(/例：.*\n.*/gm, "")
      // // quotes
      // .replace(/<font color\s*?=\s*?black\s*?>.*?<\/font>/gm, "")
      // .replace(/<.*?>/gm, "") // html tags
      // .replace(/〈.+?〉/gm, "")
      // .replace(/｛.+?｝/gm, "")
      // .replace(/〔.+?〕/gm, "")
      // .replace(/^‐/gm, "")
      // .replace(/［.*?］/gm, "")
      // .replace(/^[１-８]+/gm, "")
      // .replace(/（\d+?）/gm, "")
      // .replace(/\(\d+\)/gm, "")
      // .replace(/（[^（]+?）/gm, "")
      // .replace(/（[^（]+?）/gm, "")
      // .replace(/[（(].+[)）]/gm, "")
      // pinyin line
      // .replace(/.*?[a-z].*/gm, "")
      // .replace(/\n(?:\s*\n)+/gm, "\n")
      .trim()
  );
}
