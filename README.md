# 雪星的小狼毫输入法方案

本方案主要解決以下問題：

- 用日語輸入法不会打中文，中文輸入法打不了日語，老要切換，怎麼辦？
- 並且日語輸入法也不能直接打英文……
- 会中文，在学日語，想知道同一個字怎麼用日語打？
- 会五笔，但是有些字反映不過来想用拼音打。
- 有時候想打些 emoji 😈。

## 方案列表/特性

### 雪星日本語

- 日本語(Romaji) + 拼音和字 + 五筆 86 和字 + Emoji 混合輸入
- 輸入 english 輸出 日本語（即単詞翻訳）
- 自動転換成日本語詞組
- 所有輸出反查日本語编码

#### 漢日混打 -- wen i he wasa => 問い合わさ

- 用日語輸入法不会打中文，中文輸入法打不了日語，老要切換，怎麼辦？
- 会中文，在学日語，想知道同一個字怎麼用日語打？

本方案兼容輸入拼音和平仮名混合輸入並且輸出日語詞彙。

（完美兼容偷懶直接按中文念漢語，仮名念日語的壊習慣…… eh maybe 会让你養成壊習慣 XD）

![](media/2022-12-21-19-37-19.png)

_注：這裏打i顕示ch是双拼speller遺留bug造成，TODO修復_

#### 中文混合輸入

輸入 tt 同時輸出：日本語つつ，繁体五筆，簡体五笔，顔文字（由“派生”，竹（五笔，繁簡一致），頭疼（拼音簡打））
![](media/2022-12-21-19-33-53.png)
同時，123 反査日語打法，58 反査五笔打法，emoji 反查関連漢字

### 雪星五笔（暫時没有在維護）

- 五笔 86 + 拼音 + 顔文字 + Emoji 混合输入
- 反查 86 编码

### 雪星拼音（暫時没有在維護）

- 五笔 86 + 拼音 + 顔文字 + Emoji 混合输入
- 反查 拼音

## 安装与配置

### 在 Windows 安裝

1. 首先安装 Weasel 输入法，
   官方网站：[下載及安裝 | RIME | 中州韻輸入法引擎](https://rime.im/download/)
   或使用 Chocolatey 安装 `cup weasel`
2. 安装本输入方案

   - 方法 1
     - 將本項目下載解压，将 `./Rime` の内容复制到：`C:\Users\你的用户名\AppData\Roaming\Rime` (即 %APPDATA%\Rime )
     - [配置](#配置) 输入法
   - 方法 2（需要連接互聯網）
     - 運行 `cmd /k cd "C:\Program Files (x86)\Rime\weasel-*\" && rime-install.bat`
     - 輸入 `snomiao/rime-snomiao`
     - [配置](#配置) 输入法
   - 方法 3
     - 運行 `git clone https://github.com/snomiao/rime-snomiao && cd rime-snomiao && install.bat`
   - 方法 4 （自动）
     - 運行 `npx rime-snomiao`

3. 安装完成后，请 [配置](#配置) 输入法

### Mac

1. Install squirrel by:
   1. [rime.im](https://rime.im)
   2. or `brew cask install squirrel`
2. Install recipe
   ```shell
   git clone https://github.com/snomiao/rime-snomiao
   cp rime-snomiao/Rime/* ~/Library/Rime
   # and then you must reload squrriel
   ```

- TODO, PR’s welcome

### Linux

- TODO, PR’s welcome

## 配置

| WeaselDeployer.exe          | F4                          |
| --------------------------- | --------------------------- |
| ![config](media/config.png) | ![select](media/select.png) |

## 自定义

顔文字在 [kaomoji.dict.yaml](./kaomoji.dict.yaml) 里修改

Emoji 在 `opencc` 文件夹里可以修改

拼音可以在 `snomiao.schema.yaml` 里改

```yaml
dependencies:
  - pinyin_simp
```

五笔可以自己换 98 或别的，位置如下

```yaml
translator:
  dictionary: wubi86
```

## 授权

本項目 Copyleft，本項目爱用就拿去。

（但如果需要做商用的話得注意項目中包含的其它幾個方案的 license（但应该没有這様的人吧……），如果有這種需求請参見 Reference 电進去自己看他們的 License）

## Reference & ThanksTo

本方案由以下方案排列組合而成：

- 86 版五笔
- 拼音
- Emoji
- 日本語(羅馬字)
- 顔文字（Kaomoji)

- [中日英自然码（带辅码）双拼输入法](https://github.com/lippmann/lrime)
- [Rime double pinyin plus](https://github.com/mutoe/rime)
- [OpenCC](https://github.com/BYVoid/OpenCC)
- [gkovacs/rime-japanese: 日语输入法 Input method for typing Japanese with RIME](https://github.com/gkovacs/rime-japanese/)
- [rime/rime-wubi: 【五筆字型】輸入方案](https://github.com/rime/rime-wubi)
-
