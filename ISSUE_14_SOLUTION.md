# Solution for Issue #14: Japanese Only Mode

## Problem
User wanted to use only Japanese input without interference from other input methods (Wubi, English, etc.) when using this system, since they use different input methods for other languages.

## Solution
Created a dedicated **Japanese-only input schema** called `sno_japanese`.

## How to Use

### Quick Start

1. After installing/updating rime-snomiao, press **F4** to open the schema selection menu
2. Select "**SNO 日語 Japanese Only**" from the list
3. Now you can type in Japanese without any interference from other input methods!

### What You Get

✅ Pure Japanese romaji input  
✅ Japanese pinyin lookup (prefix with `P` for Chinese character to Japanese reading conversion)  
✅ No mixing with Wubi (五笔)  
✅ No mixing with English translators  
✅ No mixing with Chinese input methods  

### Why the Previous Approach Didn't Work

Creating `snomiao.custom.yaml` with modified dependencies doesn't work because:
- The `snomiao` schema is designed as a **multi-language mixed input** schema
- Even with different dependencies, the engine configuration still mixes all input methods
- You need a **separate schema** designed specifically for Japanese-only input

## Additional Resources

For more detailed documentation, see:
- [JAPANESE_MODE.md](./JAPANESE_MODE.md) - Full documentation
- [Rime/sno_japanese.schema.yaml](./Rime/sno_japanese.schema.yaml) - The schema file
- [Rime/sno_japanese.custom.yaml.example](./Rime/sno_japanese.custom.yaml.example) - Customization examples

## Deployment

To activate the new schema:
1. Install or update to the latest version of rime-snomiao
2. Click "Deploy" (部署) in the input method menu, or press **Control+F5**
3. Press **F4** to switch to the "SNO 日語 Japanese Only" schema

---

如何让当前输入法只输入日语，不被其他五笔、英文干扰？

**解决方案**：使用新增的 `sno_japanese` 输入方案（SNO 日語 Japanese Only）

**使用方法**：
1. 部署最新配置
2. 按 F4 打开方案选择菜单
3. 选择 "SNO 日語 Japanese Only"
4. 现在可以专心输入日语了！
