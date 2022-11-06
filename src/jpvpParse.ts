import { csvParse } from "d3";
import readFileUtf8 from "read-file-utf8";
import rimeDictFileUpdate from "./rimeDictFileUpdate";
import { rimeDictUpdate } from "./rimeDictUpdate";
import workdirFix from "./workdirFix";

{
  await workdirFix();
  // const fields =
  const fields = ["English VP", "Japanese VP"] as const;
  const csv = await readFileUtf8("../dict/English_to_JapaneseVP.csv");
  const rows = csvParse<typeof fields[number]>(csv)
    .map((e) => ({
      en: e["English VP"]?.replace(/'/g, "") || "",
      jp: e["Japanese VP"]?.replace(/\((.*)\)/, "").trim() || "",
      romaji: e["Japanese VP"]?.match(/\((.*)\)/)?.[0] || "",
    }))
    .filter(({ en, jp, romaji }) => en && jp && romaji);
  await rimeDictUpdate(
    "translate_en2jp",
    rows.map(({ en, jp }) => [jp, en])
  );

  console.log(rows[0]);
}
