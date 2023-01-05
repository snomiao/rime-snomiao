import Mdict from "mdict-js";
import snohmr from "snohmr";
import workPackageDir from "work-package-dir";
import sstDictParse from "../enjp-sst/jpDictParse";
import MDictTypescript from "../lib/mdictTypescript";
import { uniqueSort } from "../lib/uniqueSort";
import { rimeDictUpdate } from "../utils/rimeDictUpdate";

export default async function index() {
  await workPackageDir();
  const pairs = await load();
  for await (const { default: parse } of snohmr(() => import("./parse")))
    await parse(pairs).catch(console.error);
  async function load() {
    const mdx = new MDictTypescript("dict/《小学馆V2中日辞典》.mdx");
    const words = mdx.keyList.map(({ keyText }) => keyText);
    const pairs = words.map((word) => [word, mdx.lookup(word).definition]);
    return pairs;
    // return [[""]];
  }

  async function zhjpDictUpdate(engWords: string[], mdx: Mdict) {
    const r = sstDictParse(engWords.sort(), mdx)
      .map(({ word, definition, translations }) =>
        uniqueSort(translations).map((t) => [t, word])
      )
      .flat();
    console.log(r);
    await rimeDictUpdate("translate_zh2jp", r);
  }
}
