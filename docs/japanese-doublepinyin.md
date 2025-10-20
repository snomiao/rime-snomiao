# 日语双拼输入法 (Japanese Double Pinyin Input Method)

## 简介 (Introduction)

`japanese_doublepinyin` 是基于小鹤双拼方案的日语输入法，允许用户使用双拼编码输入日语汉字和词汇。

## 功能特性 (Features)

- 基于小鹤双拼编码方案
- 支持日语汉字输入
- 支持简拼
- 自动繁体转日文汉字
- 笔画反查功能

## 使用方法 (Usage)

### 启用输入法 (Enable Input Method)

1. 将 `japanese_doublepinyin.schema.yaml` 放入 Rime 用户文件夹
2. 重新部署 Rime
3. 按 `F4` 或 `Ctrl+`` 选择 "朙月双拼和字"

### 双拼编码规则 (Double Pinyin Encoding Rules)

本方案使用小鹤双拼编码：

#### 韵母编码 (Finals)
- `iu` → `q`
- `ei` → `w`
- `uan` → `r`
- `ue/ve` → `t`
- `un` → `y`
- `uo` → `o`
- `ie` → `p`
- `ong/iong` → `s`
- `ing/uai` → `k`
- `ai` → `d`
- `en` → `f`
- `eng` → `g`
- `iang/uang` → `l`
- `ang` → `h`
- `ian` → `m`
- `an` → `j`
- `ou` → `z`
- `ia/ua` → `x`
- `iao` → `n`
- `ao` → `c`
- `ui` → `v`
- `in` → `b`

#### 声母编码 (Initials)
- `sh` → `u`
- `ch` → `i`
- `zh` → `v`

#### 零声母 (Zero Initial)
- 零声母音节需要双击韵母首字母，例如：
  - `an` → `aj`
  - `ang` → `ah`
  - `ao` → `ac`
  - `ai` → `ad`

## 示例 (Examples)

### 输入示例
- 中国 `vggo` (zh→v, ong→s, gu→go, o→o)
- 学习 `xtxp` (x, ue→t, x, i→p)
- 知识 `viui` (zh→v, i, sh→u, i)

## 反查功能 (Reverse Lookup)

按 `` ` `` 键启用笔画反查，支持以下笔画：
- `h` 一（横）
- `s` 丨（竖）
- `p` 丿（撇）
- `n` 丶（捺）
- `z` 乙（折）

## 相关文件 (Related Files)

- `japanese_doublepinyin.schema.yaml` - 输入法方案配置
- `japanese_pinyin.dict.yaml` - 词库文件（共用全拼词库）

## 参考 (References)

- [小鹤双拼官网](https://flypy.com/)
- [Rime 双拼输入方案](https://github.com/rime/rime-double-pinyin)
