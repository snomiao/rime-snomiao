# 雪星的小狼毫输入法方案

由以下方案混合： 86 版五笔 | 拼音 | Emoji | 顔文字（Kaomoji)

例图：![例图](media/例图.png)

## 安装与配置

### 在 Windows 安裝

1. 首先安装 Weasel 输入法，
   官方网站：[下載及安裝 | RIME | 中州韻輸入法引擎](https://rime.im/download/)
   或使用 Chocolatey 安装 `cup weasel`
2. 安装本输入方案

- 方法 1
  - 將本項目下載解压到：`C:\Users\你的用户名\AppData\Roaming\Rime` (即 %APPDATA%\Rime )
- 方法 2（需要連接互聯網）
  - 運行 `cmd /k cd "C:\Program Files (x86)\Rime\weasel-*\" && rime-install.bat`
  - 輸入 `snomiao/rime-snomiao`
- 方法 3
  - 運行 `git clone https://github.com/snomiao/rime-snomiao && cd rime-snomiao && install.bat`

3. 安装完成后，请 [配置](#配置) 输入法

### Mac 和 Linux 用户自己找自己的目录哈

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

Copyleft，爱用就拿去
