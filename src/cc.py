import opencc
converter = opencc.OpenCC('t2jp.json')
with open('Rime/pinyin_japanese.dict.yaml') as f:
    print (converter.convert(f.read()))