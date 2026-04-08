# Japanese-Only Mode / 日本語専用モード

## Overview

The `sno_japanese` schema provides a Japanese-only input mode without interference from other input methods like Wubi (五笔) or English.

## How to Enable

### Method 1: Using the Input Method Menu (Recommended)

1. After deploying the configuration, press **F4** or click the input method icon
2. Select "SNO 日語 Japanese Only" from the schema list
3. Now you can type in Japanese without interference from other input methods

### Method 2: Setting as Default

To make Japanese-only mode your default input method, create or edit `default.custom.yaml` in your Rime configuration folder:

**Windows**: `%APPDATA%\Rime\default.custom.yaml`  
**macOS**: `~/Library/Rime/default.custom.yaml`  
**Linux**: `~/.config/ibus/rime/default.custom.yaml` or `~/.config/fcitx/rime/default.custom.yaml`

Add or modify the following content:

```yaml
patch:
  schema_list:
    - schema: sno_japanese
```

After making changes, click "Deploy" (部署) or press **Control+F5** to reload the configuration.

## Features

### Basic Japanese Input

Type romaji (Roman letters) to input Japanese:
- `konnichiha` → こんにちは
- `nihongo` → にほんご
- `arigatou` → ありがとう

### Japanese Pinyin Lookup

If you know how to pronounce a Chinese character in Mandarin Pinyin and want to type it in Japanese, use the `P` prefix:

1. Type `P` followed by the pinyin
2. For example: `Pni` for 你
3. Press `'` to confirm

### Input Conversion

- Press **Shift** to toggle between Chinese and English (西文) mode
- Use punctuation patterns like `/1`, `/2` for special symbols

## Customization

You can customize the schema by creating `sno_japanese.custom.yaml` in your Rime configuration folder:

```yaml
patch:
  # Example: Change page size
  menu/page_size: 9
  
  # Example: Add custom key bindings
  key_binder/bindings:
    - { accept: "Control+j", toggle: simplification, when: always }
```

## Troubleshooting

### Issue: Still seeing Chinese/English candidates

**Solution**: Make sure you have selected "SNO 日語 Japanese Only" from the schema list (press F4), not the mixed "SNO 雪星" schema.

### Issue: Japanese dictionary not working

**Solution**: Make sure all dependencies are properly deployed. Try re-deploying the configuration.

## Related Schemas

- `sno_jpn_wubi86_eng`: Mixed Japanese, Wubi, and English input
- `japanese`: Pure Japanese input
- `japanese_pinyin`: Pinyin to Japanese conversion

---

For more information, visit: https://github.com/snomiao/rime-snomiao
