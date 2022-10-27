import { assert } from "console";
import Mdict from "mdict-js";

export default function jpDictParse(engWordsSample: string[], mdx: Mdict) {
  const wordPairs = [...new Set(engWordsSample)]
    .sort()
    .map((keyText) => {
      const r = mdx.lookup(keyText);
      if (r.keyText !== keyText) return [];
      assert(
        r.keyText === keyText,
        JSON.stringify({ rkt: r.keyText, kt: keyText })
      );
      return [[r.keyText, r.definition] as [string, string]];
    })
    .flat();

  return [...new Map(wordPairs).entries()]
    .map(([keyText, definition]) => {
      const word = keyText;
      if (word.match(/^[A-Z]/)) return [];
      if (word.length < 2) return [];
      const translations = definition
        .replace(/\r/g, "\n")
        .replace(/\x00/g, "\n")
        .replace(/^◎.*/gm, "")
        .replace(/◎.*/gm, "")
        .replace(/\<.*?\>/g, "") // 標籤
        .replace(/&lt;/g, "<") // HTML
        .replace(/&gt;/g, ">") //
        .replace(/\<.*?\>|《.*?》/g, "") // 領域，書名號
        .replace(/\(\d+\)/g, "\n") // 序號
        .replace(/\([^\(]*?\)|（[^（]*?）/g, "") // 备注
        .replace(/\([^\(]*?\)|（[^（]*?）/g, "") // 备注
        .replace(/{.*?}|｛.*?｝/g, "") // 顏色？
        .replace(/\[.*?\]|【.*?】/g, "") // 领域、国家
        .replace(/〔.*?〕/g, "") // 年代
        .replace(/\d\)。/g, "") // 序号
        // .replace(/[a-z]+(?:・[a-z]+)+/g, "") //頭言葉
        .replace(/\*|・/g, "") // 符號
        .replace(/[;；,，。.]+/g, ";") // 符號
        .replace(/"/g, "") // 引号

        // 詞性;/
        .replace(
          /\b(?:a|abbr|ad|adj|adv|art|aux|comb|conj|en|exclam|i|ind|ing|int|interj|n|na|ngn|num|onn|pers|ph|phn|phr|pl|pla|pn|pp|pr|pref|prep|pron|st|suff|un|v|vbl|vi|vt)(?:\.|\b)/g,
          ";"
        )
        // .replace(/[^\s; \u4E00-\u9FFF \u3040-\u309Fー \u30A0-\u30FF]+/g, "")
        .replace(/\<br\s*?\/?\>/g, ";")
        .replace(/〖.*?〗/g, ";") // english -> romaji word
        .replace(/\s+/, " ")
        .trim()
        .split(";")
        .map((e) => e.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .filter((e) => !e.match(/^[a-z0-9]+$/i))
        .filter((e) => e.length < 16);
      if (!translations.length) return [];
      return [{ word, definition, translations }];
    })
    .flat();
}
