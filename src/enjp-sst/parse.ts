import Mdict from "mdict-js";
import snohmr from "snohmr";
import MDictTypescript from "../lib/mdictTypescript";
import { uniqueSort } from "../lib/uniqueSort";
import workPackageDir from "../lib/workPackageDir";
import { rimeDictUpdate } from "../utils/rimeDictUpdate";
import sstDictParse from "./jpDictParse";
{
  await workPackageDir();
  const mdx = new MDictTypescript("dict/三省堂超级大辞林第二版.mdx");
  const words = mdx.keyList.map(({ keyText }) => keyText);
  const engWords = words.filter((e) => e.match(/^[ a-zA-Z]+$/));
  const engWordsSample = engWords.sort(() => Math.random() - 0.5).slice(0, 10);
  await enjpDictUpdate(engWords, mdx);
  //
  // await snohmr<typeof import("./jpDictUpdate")>(
  //   "src/jpDictUpdate.ts",
  //   async (m) => await m.default(engWordsSample, mdx)
  // );
}

async function enjpDictUpdate(engWords: string[], mdx: Mdict) {
  const r = sstDictParse(engWords.sort(), mdx)
    .map(({ word, definition, translations }) =>
      uniqueSort(translations).map((t) => [t, word])
    )
    .flat();
  console.log(r);
  await rimeDictUpdate("translate_en2jp", r);
}
