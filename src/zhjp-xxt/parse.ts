import { filter, map, pipe, sortBy } from "rambda";
import { JSDOM } from "jsdom";
import chalk from "chalk";
export default async function parse(pairs: string[][]) {
  const sample = pipe(
    () => pairs,
    sortBy(Math.random),
    (e) => e.slice(0, 10),
    filter(([k, v]) => Boolean(v)),
    map(([k, v]) => {
      // get plaint text (maybe there are other simple libraries)
      const text = new JSDOM(v).window.document.body.textContent;
      if (!text) throw new Error("no text");
      const results =
        v
          .match(/.*?．|.*/g)
          ?.filter(Boolean)
          // remove chinese explanations
          .map((e) => e.replace(/.*?【.*】.*/g, ""))
          .map((e) => e.replace(/.*?～.*/g, ""))
          // remove quote and chars
          .map((e) => e.replace(/．/g, ""))
          .map((e) => e.replace(/\(.*?\)/g, ""))
          .map((e) => e.replace(/（[\s\S\n]*?）/g, ""))
          .map((e) => e.replace(/<.*?>/g, ""))
          .map((e) => e.replace(/〈.*〉/g, ""))
          .map((e) => e.replace(/..........+/g, "")) // no more than 10 chars
          .map((e) => e.trim())
          // dont suru
          .filter((e) => e !== text + "する")
          // dont tomo
          .filter((e) => !e.match(/とも$/))
          // filter
          .filter(Boolean) || [];
      console.log(chalk.bgCyanBright(chalk.black(k)));
      console.log(chalk.red(results.join("\n")));
      console.log(chalk.green(text));
      console.log(chalk.blue(v));
      return [k, v, text];
    })
  )();
}
