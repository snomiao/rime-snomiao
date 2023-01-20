import MDictTypescript from "../mdictTypescript";

export default async function mdxEntriesParse(mdxFile: string) {
  const mdx = new MDictTypescript(mdxFile);
  const words = mdx.keyList.map(({ keyText }) => keyText);
  const entires = words.map(
    word =>
      [word, mdx.lookup(word).definition?.replace(/[\x00\r]/gm, "")] as const
  );
  return entires;
}
