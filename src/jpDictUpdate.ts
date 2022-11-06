import Mdict from "mdict-js";
import rimeDictFileUpdate from "./rimeDictFileUpdate";
import jpDictParse from "./jpDictParse";
import { rimeDictUpdate } from "./rimeDictUpdate";
import { uniqueSort } from "./uniqueSort";

export default async function jpDictUpdate(engWords: string[], mdx: Mdict) {
  const r = jpDictParse(engWords.sort(), mdx)
    .map(({ word, definition, translations }) =>
      uniqueSort(translations).map((t) => [t, word])
    )
    .flat();
  console.log(r);
  await rimeDictUpdate("translate_en2jp", r);
}
