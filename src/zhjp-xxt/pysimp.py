
# run below to install deps
"""
!pip install opencc
"""

# from pathlib import Path

i = 'Rime/pinyin_simp.dict.yaml'
o = 'Rime/japanese_pinyin_simp.dict.yaml'
s = ''

with open(i) as f:
    s = f.read()

import opencc
s2t = opencc.OpenCC('s2t.json')
t2jp = opencc.OpenCC('t2jp.json')
s = s.replace('pinyin_simp', 'japanese_pinyin_simp')
s = s2t.convert(s)
s = t2jp.convert(s)

with open(o, 'w') as f:
    f.write(s)

print('done')