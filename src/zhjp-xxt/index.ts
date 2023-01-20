import chalk from "chalk";
import esMain from "es-main";
import { writeFile } from "fs/promises";
import { flatMap } from "lodash-es";
import { pipe, sortBy } from "rambda";
import snohmr from "snohmr";
import { m } from "vitest/dist/index-9f5bc072";
import workPackageDir from "work-package-dir";
import mdxFileParse from "../lib/mdxFileParse";

if (esMain(import.meta)) await index();

export default async function index() {
  await workPackageDir();
  const entires = await mdxFileParse("dict/《小学馆V2中日辞典》.mdx");
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
  const ww = flatMap(entries, ([w0, definition]) => {
    w0 = w0.replace(/ \d+$/, "");
    const rawWords =
      definition
        // chars
        .replace(/[\x00\r]/gm, "")
        .replace(/[.-]/gm, "")
        // chinese explanations
        .replace(/^.*?【補足】.*(?:\n.*)*/gm, "")
        .replace(/^.*?【比較】.*(?:\n.*)*/gm, "")
        .replace(/^.*?【用法】.*(?:\n.*)*/gm, "")
        .replace(/^.*?【異読】.*(?:\n.*)/gm, "")
        .replace(/^.*?【熟語】.*(?:\n.*)/gm, "")
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
        .replace(/^）/gm, "")
        // pinyin line
        .replace(/.*?[a-z].*/gm, "")
        .replace(/\n(?:\s*\n)+/gm, "\n")
        .trim()
        .match(/.+?．|.+/g) || [];
    const words = rawWords
      // remove quote and chars
      .map(e => e.replace(/．/gm, ""))
      .flatMap(e =>
        [...e.matchAll(/(?:(?:.+),)?(.+?)(?:;|$)|(.+)/g)].map(e => e[1] || e[2])
      )
      .map(e => e.replace(/^................+/gm, "")) // no more than 20 chars
      .map(e => e.trim())
      // dont only suru, dont tomo
      .filter(e => e !== `${w0}する`)
      .filter(e => !e.match(/^,+$/))
      .filter(e => !e.match(/とも$/))
      .filter(Boolean);
    if (!words.length) return [];
    if (/* k > 0 ||  */ w0 === "打") {
      if (k > 0) k = k - 1;
      console.log(chalk.bgBlue(w0));
      console.log(chalk.blue(definition));
      console.log(chalk.red(wordsIndicate(rawWords)));
      console.log(chalk.green(wordsIndicate(words)));
      console.log("");
    }
    return words.map(w1 => [w0, w1]);
  });

  const zhjp = pipe(
    () =>
      [
        ...ww
          .reduce(
            (m, [w0, w1]) => (m.set(w0, [...(m.get(w0) ?? []), w1]), m),
            new Map<string, string[]>([])
          )
          .entries(),
      ].map(([w0, w1s]) => `${w0}\t${w0} ${w1s.join(" ")}`),
    sortBy(e => -e.length),
    e => e.join("\n")
  )();
  const jpzh = pipe(
    () =>
      [
        ...ww
          .reduce(
            (m, [w1, w0]) => (m.set(w0, [...(m.get(w0) ?? []), w1]), m),
            new Map<string, string[]>([])
          )
          .entries(),
      ].map(([w0, w1s]) => `${w0}\t${w0} ${w1s.join(" ")}`),
    sortBy(e => -e.length),
    e => e.join("\n")
  )();
  // return [
  //   `${w0}	${[w0, ...words].join(" ")}`,
  //   ...words.map((w1) => `${w1}	${[w0, ...words].join(" ")}`),
  // ];
  await writeFile("Rime/opencc/zhjp_word.txt", zhjp + "\n" + jpzh);
  console.log(new Date());

  // console.log(sample.slice(0, 1000));
}
function wordsIndicate(words: string[]) {
  return words.join("\n").replace(/^.+/gm, e => "> " + e);
}
