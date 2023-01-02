import Mdict from "mdict-js";
import rimeDictFileUpdate from "../utils/rimeDictFileUpdate";
import sstDictParse from "./jpDictParse";
import { rimeDictUpdate } from "../utils/rimeDictUpdate";
import { uniqueSort } from "../lib/uniqueSort";

export default async function enjpDictUpdate(engWords: string[], mdx: Mdict) {
  const r = sstDictParse(engWords.sort(), mdx)
    .map(({ word, definition, translations }) =>
      uniqueSort(translations).map((t) => [t, word])
    )
    .flat();
  console.log(r);
  await rimeDictUpdate("translate_en2jp", r);
}
