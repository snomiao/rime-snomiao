import { csvParse, DSVRowArray } from "d3";
import esMain from "es-main";
import { globby } from "globby";
import { groupBy, map, pipe, toPairs, uniq } from "rambda";
import readFileUtf8 from "read-file-utf8";
import snohmr from "snohmr";
import workPackageDir from "work-package-dir";
import rimeDictFileUpdate from "../utils/rimeDictFileUpdate";
// import rimeDictFileUpdate from "../utils/rimeDictFileUpdate";

if (esMain(import.meta)) {
  await main();
}

const cols = ["emoji", "name", "group", "sub_group", "codepoints"] as const;
type ColType = (typeof cols)[number];
async function main() {
  await workPackageDir();
  const aoj = csvParse<ColType>(
    await readFileUtf8((await globby("src/emoji/emoji_df.csv"))[0])
  );
  for await (const { parse } of snohmr(() => import("./index")))
    parse(aoj).catch(console.error);
}

export async function parse(aoj: DSVRowArray<ColType>) {
  const entries = pipe(
    () => aoj,
    // sortBy(() => (Math.random() > 0.5 ? -1 : 1)),
    // .slice(0, 100)
    e =>
      e.flatMap(({ emoji, name, group, sub_group }) => {
        if (!emoji) return [];
        return [name, group, sub_group]
          .flatMap(suffixCodeList)
          .map(code => [code, emoji] as const);
      }),
    e => uniq(e)
  )();
  const codeFreq = pipe(
    () => entries,
    groupBy(([code, emoji]) => code),
    e => toPairs(e),
    map(([code, entries]) => [code, entries.length] as const),
    e => new Map(e)
  )();
  const emojiFreq = pipe(
    () => entries,
    groupBy(([code, emoji]) => emoji),
    e => toPairs(e),
    map(([emoji, entries]) => [emoji, entries.length] as const),
    e => new Map(e)
  )();
  await Promise.all([
    updateEmojiCode(entries, emojiFreq, codeFreq),
    updateCodeCode(entries, emojiFreq, codeFreq),
  ]);
}

async function updateCodeCode(
  entries: (readonly [string, string])[],
  emojiFreq: Map<string, number>,
  codeFreq: Map<string, number>
) {
  const contents = entries
    .flatMap(([code, emoji]) =>
      !(code && emoji)
        ? []
        : [
            [
              emoji,
              code,
              -(emojiFreq.get(emoji) || 0) * (codeFreq.get(code) || 0),
            ].join("\t"),
          ]
    )
    .join("\n");
  console.log(contents.length);
  await rimeDictFileUpdate("Rime/sno_emoji.code.dict.yaml", contents);
}

async function updateEmojiCode(
  entries: (readonly [string, string])[],
  emojiFreq: Map<string, number>,
  codeFreq: Map<string, number>
) {
  const contents = entries
    .flatMap(([code, emoji]) =>
      !(code && emoji)
        ? []
        : [
            [
              emoji,
              code,
              -(emojiFreq.get(emoji) || 0) * (codeFreq.get(code) || 0),
            ].join("\t"),
          ]
    )
    .join("\n");
  console.log(contents.length);

  // // console.log(entries.map(e => e.join(" ")).join("\n"));
  // for await (const { default: rimeDictFileUpdate } of snohmr(
  //   () => import("../utils/rimeDictFileUpdate")
  // ))
  await rimeDictFileUpdate("Rime/sno_emoji.dict.yaml", contents);
}

function suffixCodeList(name: string | undefined) {
  return (
    name
      ?.toLowerCase()
      .replace(/[^a-z]+/g, " ")
      // .replace(/ face/g, "")
      // .replace(/face /g, "")
      // .replace(/with /g, "")
      // .replace(/ emotion/g, "")
      .split(" ")
      ?.map((_, i, a) => a.slice(i).join("")) ?? []
  );
}
