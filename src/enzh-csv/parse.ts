import { csvParse } from "d3";
import { sortBy } from "rambda";
import readFileUtf8 from "read-file-utf8";
import "semver";
import { rimeDictArrayUpdate } from "../utils/rimeDictUpdate";
import { sortedUniq } from "lodash-es";
import workPackageDir from "work-package-dir";
{
  await workPackageDir();
  const dictPath = "dict/enzh.csv";
  const csv = await enzhCsvParse(dictPath);
  const csvLineCount = csv.length;
  console.log({ csvLineCount });
  const entries = csv
    .map(e => {
      // filter
      if (!e.word) return [];
      if (!e.word?.match(/^[a-zA-Z ]+$/)) return [];
      if (!e.translation) return [];
      const word = e.word.replace(/\s+/g, " ").trim();
      if (!(word.length > 1)) return [];
      // if (word.match(/ /i)) return []; // no phrase
      // map
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
        .map(e => e.trim())
        .filter(Boolean)
        .filter(e => !e.match(/^\d+$/))
        .map(e => e.replace(/\s+/g, " "))
        .filter(e => !e.match(/^人名$/g))
        .filter(e => !e.match(/^的(复数|变形)$/g))
        .filter(e => !e.match(/^家.{1,3}科$/g))
        .filter(e => !e.match(/^来源于(?:.+?英语|人名)$/g));
      return sortedUniq(ts).map(translation => ({
        word,
        translation,
        frequent: e.frq || "",
      }));
    })
    .flat();
  const sortedEntries = sortBy(e => e.word.toLowerCase(), entries);
  const abbr = sortedEntries.map(e => ({
    w: e.word,
    lower: e.word.toLowerCase(),
    tr: e.translation,
    frq: e.frequent,
  }));
  const pairsCount = abbr.length;
  console.log({ pairsCount });

  await Promise.all([
    rimeDictArrayUpdate(
      "translate_en2zh",
      abbr.map(e => [e.tr, e.lower, e.frq])
    ),
    rimeDictArrayUpdate(
      "translate_zh2en",
      abbr.map(e => [e.lower, e.tr])
    ),
    // rimeDictUpdate(
    //   "translate_en2en",
    //   abbr.map((e) => [e.w, e.lower])
    // ),
  ]);
  console.log("update done");
}
async function enzhCsvParse(dictPath: string) {
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
  const csv = csvParse<(typeof dictFields)[number]>(
    await readFileUtf8(dictPath)
  );
  return csv;
}
