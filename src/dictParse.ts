import { csvParse } from "d3";
import { writeFile } from "fs/promises";
import path from "path";
import { groupBy, map, mapObjIndexed, sortBy } from "rambda";
import readFileUtf8 from "read-file-utf8";
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
  const dictPath = "./en-cn.csv";
  const csv = csvParse<typeof dictFields[number]>(await readFileUtf8(dictPath));
  const csvLineCount = csv.length;
  console.log({ csvLineCount });

  const en2zhDictPairs = csv
    .map((e) => {
      if (!e.word) return [];
      if (!e.word?.match(/^[a-zA-Z ]+$/)) return [];
      if (!e.translation) return [];
      const w = e.word.replace(/\s+/g, " ");
      if (!(w.length > 1)) return [];
      const ts = e.translation
        .replace(/&/g, "")
        .replace(/\<.*?\>/g, "") // ?
        .replace(/\(.*?\)|（.*?）/g, "") // 备注
        .replace(/\[.*?\]|【.*?】/g, "") // 领域、国家
        .replace(/〔.*?〕/g, "") // 年代
        .replace(/\\n/g, ";")
        .replace(
          /\b(?:a|adj|adv|abbr|aux|art|comb|conj|en|exclam|i|Inc|ind|ing|interj|ngn|onn|pers|ph|phn|phr|pla|pn|pp|pr|pref|pron|sorry|st|suff|tambalan|vbl|pl|prep|n|na|num|v|vi|vt|un|int)(?:\.|\b)/g,
          ";"
        )
        .replace(/(?<=[a-z])\s+(?=[一-頡])/, ",")
        .replace(/[;；,，]+/g, ";")
        .replace(/…/g, "什么")
        .replace(/\.\.\./g, "什么")
        .split(";")
        .map((e) => e.trim())
        .filter(Boolean)
        .filter((e) => !e.match(/^\d+$/))
        .map((e) => e.replace(/\s+/g, " "))
        .filter((e) => !e.match(/^人名$/g))
        .filter((e) => !e.match(/^的(复数|变形)$/g))
        .filter((e) => !e.match(/^家.{1,3}科$/g))
        .filter((e) => !e.match(/^来源于(?:.+?英语|人名)$/g));
      return [...new Set(ts)].sort().map((t) => [w, t]);
    })
    .flat()
    // sample
    // .sort(() => Math.random() - 0.5).slice(0, 1e3)
    .sort();
  await writeFile("./pairs.json", JSON.stringify(en2zhDictPairs, null, 2));
  const pairsCount = en2zhDictPairs.length;
  console.log({ pairsCount });

  const groups = groupBy(([en, zh]) => en, en2zhDictPairs);
  const anal = sortBy(
    ([zh, count]) => count,
    Object.entries(map((group, zh) => group.length, groups))
  )
    .reverse()
    .filter(([zh, count]) => count > 10);
  console.log(anal);

  const en2zhTSV = en2zhDictPairs
    .map(([en, zh]) => [zh, en.toLowerCase()].join("\t"))
    .join("\n");
  await dictUpdate("../Rime/translate_en2zh.dict.yaml", en2zhTSV);

  // const zh2enTSV = en2zhDictPairs
  //   .map(([en, zh]) => [en, zh].join("\t"))
  //   .join("\n");
  // await dictUpdate("../Rime/translate_zh2en.dict.yaml", zh2enTSV);

  const en2enTSV = en2zhDictPairs
    .map(([en, zh]) => [en, en.toLowerCase()].join("\t"))
    .join("\n");
  await dictUpdate("../Rime/translate_en2en.dict.yaml", en2enTSV);
}
async function dictUpdate(dictYamlPath: string, dictContent: string) {
  const replacedYaml = (await readFileUtf8(dictYamlPath)).replace(
    /\.\.\.[\s\S]*$/,
    `...\n\n${dictContent}\n\n`
  );
  await writeFile(dictYamlPath, replacedYaml);
  console.log(dictYamlPath + " dict content updated");
}

function workdirFix() {
  const workdir = path.parse(process.argv[1]).dir;
  process.chdir(workdir);
  console.log({ workdir });
}
