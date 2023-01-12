
# run below to install deps
"""
!pip install opencc
"""

from pathlib import Path
import opencc
s2t = opencc.OpenCC('s2t.json')
t2jp = opencc.OpenCC('t2jp.json')

i = 'Rime/opencc/zhjp_word.txt'
o = 'Rime/opencc/zhjp_word.txt'
s = ''

with open(i) as f:
    s = f.read()

s = s2t.convert(s)
s = t2jp.convert(s)

with open(o, 'w') as f:
    f.write(s)

print('done')