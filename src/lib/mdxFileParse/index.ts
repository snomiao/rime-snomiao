import MDictTypescript from "../mdictTypescript";

export default async function mdxFileParse(mdxFile: string) {
  const mdx = new MDictTypescript(mdxFile);
  const words = mdx.keyList.map(({ keyText }) => keyText);
  const entires = words.map((word) => [word, mdx.lookup(word).definition]);
  return entires;
}
