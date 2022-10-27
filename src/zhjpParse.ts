import Mdict from "mdict-js";
import workdirFix from "./workdirFix";
// TODO

{
  await workdirFix();
  const mdx = new Mdict("../zhjp.mdx");
  console.log(mdx);
}

// 三省堂超级大辞林第二版.mdx
