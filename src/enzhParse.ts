import "semver";
import { exec } from "child_process";
import { csvParse } from "d3";
import { execa } from "execa";
import { mkdir, writeFile } from "fs/promises";
import { groupBy, map, mapObjIndexed, replace, sortBy } from "rambda";
import readFileUtf8 from "read-file-utf8";
import snorun from "snorun";
import { promisify } from "util";
import workdirFix from "./workdirFix";
import { dictUpdate } from "./dictUpdate";
{
  workdirFix();

  const dictFields = [
    "word",
    "phonetic",
    "definition",
    "translation",
    "pos",
    "collins",
    "oxford",
    "tag",
    "bnc",
    "frq",
    "exchange",
    "detail",
    "audio",
  ] as const;
  const dictPath = "../dict/enzh.csv";
  const csv = csvParse<typeof dictFields[number]>(await readFileUtf8(dictPath));
  const csvLineCount = csv.length;
  console.log({ csvLineCount });

  const unsortedDictPairs = csv
    .map((e) => {
      if (!e.word) return [];
      if (!e.word?.match(/^[a-zA-Z ]+$/)) return [];
      if (!e.translation) return [];
      const w = e.word.replace(/\s+/g, " ").trim();
      if (!(w.length > 1)) return [];
      if (w.match(/ /i)) return []; // no phrase
      const ts = e.translation
        .replace(/&/g, "")
        .replace(/\<.*?\>/g, "") // 專業
        .replace(/\(.*?\)|（.*?）/g, "") // 备注
        .replace(/\[.*?\]|【.*?】/g, "") // 领域、国家
        .replace(/〔.*?〕/g, "") // 年代
        .replace(/\d\)。/g, "") // 序号
        .replace(/"/g, "") // 引号
        .replace(/\\n/g, ";")
        .replace(
          /\b(?:a|abbr|adj|adv|art|aux|comb|conj|en|exclam|i|ind|ing|int|interj|n|na|ngn|num|onn|pers|ph|phn|phr|pl|pla|pn|pp|pr|pref|prep|pron|st|suff|un|v|vbl|vi|vt)(?:\.|\b)/g,
          ";"
        )
        .replace(/(?<=[a-z])\s+(?=[一-頡])/, ",")
        .replace(/[;；,，]+/g, ";")
        .replace(/…+/g, "什么")
        .replace(/\.\.\.+/g, "什么")
        .split(";")
        .map((e) => e.trim())
        .filter(Boolean)
        .filter((e) => !e.match(/^\d+$/))
        .map((e) => e.replace(/\s+/g, " "))
        .filter((e) => !e.match(/^人名$/g))
        .filter((e) => !e.match(/^的(复数|变形)$/g))
        .filter((e) => !e.match(/^家.{1,3}科$/g))
        .filter((e) => !e.match(/^来源于(?:.+?英语|人名)$/g));
      return [...new Set(ts)].sort().map((t) => [w, t, e.frq || ""]);
    })
    .flat();
  const en2zhDictPairs = sortBy(
    (e) => e[0].toLowerCase(),
    unsortedDictPairs
    // take sample if needed
    // .sort(() => Math.random() - 0.5)
    // .slice(0, 1e6)
    //
  );
  const distPath = "../dist";
  await mkdir(distPath, { recursive: true });
  await writeFile(
    `${distPath}/pairs.json`,
    JSON.stringify(en2zhDictPairs, null, 2)
  );
  const pairsCount = en2zhDictPairs.length;
  console.log({ pairsCount });

  const enGroups = groupBy(
    ([en, zh]) => en.slice(0, 3).toLowerCase(),
    en2zhDictPairs
  );
  const zhGroups = groupBy(([en, zh]) => zh, en2zhDictPairs);
  const setCounting = sortBy(
    ([zh, count]) => count,
    Object.entries(map((group) => group.length, zhGroups))
  ).reverse();

  const limitWords = new Set(
    setCounting.filter(([zh, count]) => count >= 100).map((e) => e[0])
  );

  {
    const zhGroups = groupBy(([en, zh]) => zh, en2zhDictPairs);
    const setCounting = sortBy(
      ([zh, count]) => count,
      Object.entries(map((group) => group.length, zhGroups))
    ).reverse();
    console.log(setCounting);
  }
  const en2zhTSV = en2zhDictPairs
    .map(([en, zh, frq]) => [zh, en.toLowerCase(), frq].join("\t"))
    .join("\n");
  await dictUpdate("../Rime/translate_en2zh.dict.yaml", en2zhTSV);

  // const en2enTSV = en2zhDictPairs
  //   .map(([en, zh]) => [en, en.toLowerCase()].join("\t"))
  //   .join("\n");
  // await dictUpdate("../Rime/translate_en2en.dict.yaml", en2enTSV);

  console.log("update done");
}
