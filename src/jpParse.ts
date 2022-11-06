import snohmr from "snohmr";
import jpDictUpdate from "./jpDictUpdate";
import Mdict from "./mdictFix";
import workdirFix from "./workdirFix";
{
  await workdirFix();
  const mdx = new Mdict("dict/三省堂超级大辞林第二版.mdx");
  const words = mdx.keyList.map(({ keyText }) => keyText);
  const engWords = words.filter((e) => e.match(/^[ a-zA-Z]+$/));
  const engWordsSample = engWords.sort(() => Math.random() - 0.5).slice(0, 10);
  await jpDictUpdate(engWords, mdx);
  // 
  // await snohmr<typeof import("./jpDictUpdate")>(
  //   "src/jpDictUpdate.ts",
  //   async (m) => await m.default(engWordsSample, mdx)
  // );
}
