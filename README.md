# rime-snomiao Multilingual IME (EN+JA+ZH)

The integrated input method for multilingual users now supports mixed input of Pinyin, Wubi, Roman letters, and English, with the addition of integrated vocabulary translation.

多语言使用者一体化输入法，集成词汇翻译混合编码输入，现在支持拼音+五笔+罗马字+英语混合输入。

多言語話者向けオールインワン入力ソリューション、統合語彙翻訳ハイブリッドコーディング入力、今ピンイン+五笔+ローマ字+英語の混合入力をサポート。

|||
|-|-|
|<video src="./media/hai-understand.mp4" autoplay></video>||

- Language: [English] | [简体中文](./README.chs.md)
- Version history: [CHANGELOG](./CHANGELOG.md) · [Releases](https://github.com/snomiao/rime-snomiao/releases)

## Why?

The project mainly solve the following issues:

- Can't type Chinese using the Japanese input method, and can't type Japanese using the Chinese input method, always having to switch. What to do? (Mixed Chinese and Japanese input)
- Additionally, the system's default Japanese input method can't directly type English... (Rime by pressing Enter)
- Know English and are learning Japanese, want to know how to say a word in Japanese? (Translate English words to Japanese)
- Know Chinese and are learning Japanese, want to know how to type the same character in Japanese? (Reverse lookup for Japanese)
- Know Wubi, but sometimes can't remember certain characters and want to use Pinyin. (Mixed Wubi and Pinyin input)
- Sometimes want to type some emojis 😈. (Convert Chinese characters to emojis)

- 🌠 Realize all these dreams simultaneously (using this solution)

## List of Plans/Features

### Snowstar-Wubi ⌨️

![](media/vary-length-wubi.png)

- Improved variable-length encoding technology based on the Microsoft Wubi code table, greatly enhancing the efficiency of long sentence input in Wubi

## Quick Start


- Windows User:
  Download and Install Engine here: [下載及安裝 \| RIME | 中州韻輸入法引擎]( https://rime.im/download/ )
  `npx rime-snomiao`

- Linux User:
  Download and Install Engine here: [下載及安裝 \| RIME | 中州韻輸入法引擎]( https://rime.im/download/ )
  `brew install squirrel --cask`
  
- Mac User:
  Download and Install Engine here: [下載及安裝 \| RIME | 中州韻輸入法引擎]( https://rime.im/download/ )
  `brew install squirrel --cask`


## Installation and Configuration 🗳️

### Install in Mac, Use with OSX 🍎

1. Install Squirrel here (branch for Rime on Mac).

   1. [rime.im](https://rime.im) (official website)
   2. or `brew install squirrel --cask`

2. Install rime-snomiao receipe.

   ```shell
   git clone https://github.com/snomiao/rime-snomiao
   cd rime-snomiao
   git pull origin
   cp -r ./Rime/* ~/Library/Rime/
   ```

1. In the upper right corner of the screen, in the input method drop-down menu, click on 'Deploy' to load.

- TODO, PR's welcome.

### Install on Windows 🪟

1. Firstly, install the Weasel input method,
   Official website: [Download and Installation | RIME | Zhongzhou Rhyme Input Method Engine](https://rime.im/download/)
   or use Chocolatey to install `cup weasel`

2. Install this input scheme

- Method 0
  - Download the Release and then unzip `./Rime/*` to `C:\Users\Your username\AppData\Roaming\Rime`
  - https://github.com/snomiao/rime-snomiao/releases/
- Method 1
  - Download, unzip this project and copy the content of `./Rime` folder to: `C:\Users\Your username\AppData\Roaming\Rime` (i.e., %APPDATA%\Rime )
  - [Configure](#configure) the input method (or restart the system)
  <!-- - Method 2
  - Run
    ````
    git clone https://github.com/snomiao/rime-snomiao
    cd rime-snomiao
    git pull
    cd devtools
    install.bat
    ``` -->
- Method 3 (Automatic)
  - Run `npx rime-snomiao@latest`
    Please note that this input scheme cannot use Dongfeng Po (plum) to install.

1. After the installation is complete, please [configure](#configure) the input method

### Linux 🐧

- TODO, PR’s welcome

## Configuration

| WeaselDeployer.exe          | F4                          |
| --------------------------- | --------------------------- |
| ![config](media/config.png) | ![select](media/select.png) |

### Custom

You can modify the emoticons in [kaomoji.dict.yaml](./kaomoji.dict.yaml) (not used by default, need to be manually imported)

- [Emoji](./Rime/opencc/zh_emoji_word.json)
- [JPN Japanese 日本語 Scheme](./Rime/sno_japanese.schema.yaml)
- [CHN Chinese 中国語 Scheme](./Rime/sno_chinese.schema.yaml)

Pinyin can be changed in ``

```yaml
dependencies:
  - pinyin_simp
```

You can replace Wubi with 98 or others, at the following location

```yaml
translator:
  dictionary: wubi86
```

## Dictionary contribute 詞典贡献

Dictionary contribute 詞典贡献

1. fork rime-snomiao to your account, and clone to local
2. put this dictionary into /dict
3. git commit -a -m "YOUR dictionary NAME"
4. git push
5. view your forked branch in github
6. PR button should shown, click it

## LICENSE

This project is Copyleft, take it if you love it.

(But if you need it for commercial purposes, be aware of the licenses of the other few schemes included in the project (but there shouldn't be such people ...), if you have this requirement, please refer to Reference and go in to see their License for yourself)

## rime-snomiao Social Network

telegram: @rime_snomiao https://t.me/rime_snomiao

## References & ThanksTo

- [Full Emoji Database](https://www.kaggle.com/datasets/eliasdabbas/emoji-data-descriptions-codepoints?resource=download)
- [中日英自然码（带辅码）双拼输入法](https://github.com/lippmann/lrime)
- [Rime double pinyin plus](https://github.com/mutoe/rime)
- [OpenCC](https://github.com/BYVoid/OpenCC)
- [rime/rime-pinyin-simp: 【袖珍簡化字拼音】輸入方案](https://github.com/rime/rime-pinyin-simp)
- [rime/rime-wubi: 【五筆字型】輸入方案](https://github.com/rime/rime-wubi)
- [gkovacs/rime-japanese: 日语输入法 Input method for typing Japanese with RIME](https://github.com/gkovacs/rime-japanese/)
- [日本人名地名平假名汉字双向词典](https://mdict.org/post/riben-renming-diming/)
- [Mouse Dictionary](https://github.com/wtetsu/mouse-dictionary/wiki/Download-dictionary-data)

## About

### Author 👩‍💻

Author: snomiao <snomiao@gmail.com>
Website: [snomiao.com](https://snomiao.com)

### Sponsors 💰

- None yet.

Claim your sponsorship by donating snomiao <[Email: snomiao@gmail.com](mailto:snomiao@gmail.com)>

### Contribute 💻

The main repo is in [here](https://github.com/snomiao/rime-snomiao#readme), any issue and PR's welcome.

### References 📰

rime-snomiao 雪星的小狼毫输入法方案

- [github.com/snomiao](https://github.com/snomiao/rime-snomiao)
- [gitee.com/snomiao](https://gitee.com/snomiao/rime-snomiao)
- [github.com/rime/home](https://github.com/rime/home/issues/68#issuecomment-1383913014)
- [Zhihu](https://zhuanlan.zhihu.com/p/599268754)
- [Telegram Rime](https://t.me/loverime/41196)
- [和老外聊天……打着字就翻訳成外語了？ rime-snomiao 輸入法方案介紹。 - V2EX (2)]( https://www.v2ex.com/t/909117 )
- [Twitter](https://twitter.com/snomiao/status/1614586337822375936)

### Star history 🌟

- [![Stargazers over time](https://starchart.cc/snomiao/rime-snomiao.svg)](https://starchart.cc/snomiao/rime-snomiao)
