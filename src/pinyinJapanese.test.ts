import OpenCC from "opencc";
import readFileUtf8 from "read-file-utf8";
import topLevelGit from "top-level-git";
import { describe, it } from "vitest";
import { promisify } from "util";
const text = `
齮齕	yi he
齰舌	ze she
齲齒	qu chi
齲齒笑	qu chi xiao
齵差	yu ci
龍勺	long shuo
龍柏	long bo
龍涎	long xian
龍涎香	long xian xiang
龍無雲而不行	long wu yun er bu xing
龍爪	long zhao
龍爪	long zhua
龍爪書	long zhao shu
龍爪書	long zhua shu
龍爪槐	long zhao huai
龍爪槐	long zhua huai
龍眼乾	long yan gan
龍藏	long zang
龍藏寺碑	long zang si bei
龍虎榜	long hu bang
龍行虎步	long xing hu bu
龍躍天衢	long yue tian qu
龍躍鳳鳴	long yue feng ming
龍鍾潦倒	long zhong liao dao
龍門刨牀	long men bao chuang
龍韜	long tao
龍韜虎略	long tao hu lve
龍騰虎躍	long teng hu yue
龔行天罰	gong xing tian fa
龔黃滿朝	gong huang man chao
龜手	jun shou
龜毛兔角	gui mao tu jiao
龜筴	gui ce
龜茲	qiu ci
龜行	gui xing
龜裂	jun lie
龜趺	gui fu
𣘨橠	e nuo
𣝓弧	yan hu
𣝓絲	yan si
𣶐飯	pao fan
𧑗蝦	ning xia
𰻞𰻞麪	biang biang mian

`;
it("pinyin", async () => {
  {
    const root = await topLevelGit();
    // const content = await readFileUtf8(root + '/rime/pinyin_japanese.dict.yaml');
    const cc = new OpenCC("t2jp.json");
    console.log(await cc.convertPromise('漢字'));

    // console.log(promisify(cc.convert)(text));
  }
});
