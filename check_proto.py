# -*- coding: utf-8 -*-
"""湘仁禾私域会员 APP 原型静态校验脚本

用法：在项目根目录执行  python check_proto.py
检查项：
  1. 所有 .html 文件的标签是否配平（未闭合 / 多余闭合 / 嵌套错乱）
  2. 所有 href / src 相对链接指向的文件是否存在
"""
import os
import re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
        'link', 'meta', 'param', 'source', 'track', 'wbr'}


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errs = []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errs.append('多余闭合 </%s> @ %s' % (tag, self.getpos()))
            return
        if self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            self.errs.append('不匹配: 期望 </%s>，实际 </%s> @ %s'
                             % (self.stack[-1][0], tag, self.getpos()))
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break


files = sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))
bad = missing = 0
for f in files:
    src = open(os.path.join(ROOT, f), encoding='utf-8').read()
    p = P()
    p.feed(src)
    if p.errs or p.stack:
        bad += 1
        print('[标签] %s' % f)
        for e in p.errs:
            print('   ', e)
        for t, pos in p.stack:
            print('    未闭合 <%s> @ %s' % (t, pos))
    for h in set(re.findall(r'(?:href|src)="([^"#][^":]*?)"', src)):
        t = h.split('?')[0].split('#')[0]
        if t and not t.startswith(('http', '//')) \
                and not os.path.exists(os.path.join(ROOT, t)):
            print('[缺失] %s -> %s' % (f, h))
            missing += 1

print('页面数: %d, 标签问题页: %d, 缺失链接: %d' % (len(files), bad, missing))
