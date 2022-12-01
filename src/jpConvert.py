
# run below to install deps
"""
!pip install opencc
"""

from pathlib import Path
import opencc
converter = opencc.OpenCC('t2jp.json')
i = 'Rime/pinyin_japanese.dict.yaml'
o = 'Rime/pinyin_japanese.dict.yaml'
s = ''
with open(i) as f:
    s = f.read()
s = converter.convert(s)
with open(o, 'w') as f:
    f.write(s)

print('done')