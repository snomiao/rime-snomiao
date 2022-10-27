import { csvParse } from "d3";
import readFileUtf8 from "read-file-utf8";
import { dictUpdate } from "./dictUpdate";
import workdirFix from "./workdirFix";

{
  workdirFix();
  // const fields =
  const fields = ["English VP", "Japanese VP"] as const;
  const csv = await readFileUtf8("../dict/English_to_JapaneseVP.csv");
  const rows = csvParse<typeof fields[number]>(csv).map((e) => ({
    en: e["English VP"]?.replace(/'/g, ""),
    jp: e["Japanese VP"]
      ?.replace(/\((.*)\)/, "")
      .trim(),
    romaji: e["Japanese VP"]?.match(/\((.*)\)/)?.[0],
  }));
  await dictUpdate(
    "../Rime/translate_en2jp.vp.dict.yaml",
    rows.map(({ en, jp }) => [jp, en].join("\t")).join("\n")
  );
  
  console.log(rows[0]);
}
