# -*- coding: utf-8 -*-
"""
生成访问密码门禁脚本 assets/gate.js。

用法：
    python scripts/gen_gate.py <密码表.md> [输出路径]

原理：
    1. 解析密码表，得到按时间顺序排列的 144 个 4 位密码（每段 10 分钟）
    2. 对每个密码做 sha256(SALT|段序号|密码)，取前 16 字节 hex 作为"指纹"
    3. 指纹串再做一次字符位移混淆后写入 gate.js —— 仓库中不含任何明文密码
    4. 自动在所有 *.html 的 head 中注入 <script src="assets/gate.js"></script>
"""
import hashlib
import io
import os
import re
import sys

SALT = 'XRH-GATE-2026'


def parse_table(md_path):
    text = io.open(md_path, encoding='utf-8').read()
    pwds = re.findall(r'\*\*(\d{4})\*\*', text)
    slots = re.findall(r'\|\s*(\d{2}:\d{2})-(\d{2}:\d{2})\s*\|', text)
    if len(pwds) != 144:
        raise SystemExit('密码数量异常：%d（应为 144）' % len(pwds))
    if len(slots) != 144:
        raise SystemExit('时段数量异常：%d（应为 144）' % len(slots))
    # 校验时段顺序：第 i 段应为 i*10 分钟起
    for i, (a, b) in enumerate(slots):
        h1, m1 = [int(x) for x in a.split(':')]
        h2, m2 = [int(x) for x in b.split(':')]
        if h1 * 60 + m1 != i * 10 or h2 * 60 + m2 != i * 10 + 9:
            raise SystemExit('时段顺序异常，第 %d 段为 %s-%s' % (i, a, b))
    return pwds


def fingerprint(pwd, idx):
    return hashlib.sha256(('%s|%d|%s' % (SALT, idx, pwd)).encode()).hexdigest()[:32]


def obfuscate(s):
    """字符位移混淆：让源码里看不到规整的 hex 指纹（可逆）"""
    return ''.join(chr(ord(c) + 7 + (i % 5)) for i, c in enumerate(s))


TEMPLATE = r'''/* ============================================================
 * 访问密码门禁 · 湘仁禾私域会员APP 原型
 * ------------------------------------------------------------
 * 进入任意页面前需输入"当前时段"对应的 4 位密码：
 * 一天 144 段（每 10 分钟一段），每段一个固定密码。
 *
 * 安全说明：本文件不保存任何明文密码，只保存
 *   sha256(SALT | 段序号 | 密码) 的前 16 字节指纹（再次字符位移混淆）。
 * 校验时对用户输入做同样的运算后比对指纹，因此查看源码无法得到密码。
 * ============================================================ */
(function () {
  var SALT = '__SALT__';
  var TTL = __TTL__;                 /* 验证通过后免验证时长 */
  var FP = '__FP__';                 /* 144 段指纹（已混淆） */
  var LEN = 144;

  /* ---------- 还原指纹 ---------- */
  function deobf(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) out += String.fromCharCode(s.charCodeAt(i) - 7 - (i % 5));
    return out;
  }

  /* ---------- SHA-256 ---------- */
  function sha256(s) {
    var chrsz = 8;
    function safe_add(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
    function S(X, n) { return (X >>> n) | (X << (32 - n)); }
    function R(X, n) { return (X >>> n); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function S0(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function S1(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function G0(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function G1(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core(m, l) {
      var K = [0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,
               0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,
               0xE49B69C1,0xEFBE4786,0x0FC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,
               0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x06CA6351,0x14292967,
               0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,
               0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,
               0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,
               0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2];
      var HASH = [0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19];
      var W = new Array(64), a, b, c, d, e, f, g, h, i, j, T1, T2;
      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;
      for (i = 0; i < m.length; i += 16) {
        a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3];
        e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
        for (j = 0; j < 64; j++) {
          if (j < 16) W[j] = m[j + i];
          else W[j] = safe_add(safe_add(safe_add(G1(W[j - 2]), W[j - 7]), G0(W[j - 15])), W[j - 16]);
          T1 = safe_add(safe_add(safe_add(safe_add(h, S1(e)), Ch(e, f, g)), K[j]), W[j]);
          T2 = safe_add(S0(a), Maj(a, b, c));
          h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
        }
        HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
    }
    function s2b(str) {
      var bin = [], mask = (1 << chrsz) - 1;
      for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
      }
      return bin;
    }
    function b2h(bin) {
      var tab = '0123456789abcdef', str = '';
      for (var i = 0; i < bin.length * 4; i++) {
        str += tab.charAt((bin[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
               tab.charAt((bin[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
      }
      return str;
    }
    return b2h(core(s2b(s), s.length * chrsz));
  }

  /* ---------- 时段 ---------- */
  function segIndex(d) {
    d = d || new Date();
    var i = Math.floor((d.getHours() * 60 + d.getMinutes()) / 10);
    return i < 0 ? 0 : (i > LEN - 1 ? LEN - 1 : i);
  }
  function segText(i) {
    function hm(n) {
      var h = Math.floor(n / 60), m = n % 60;
      return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }
    return hm(i * 10) + ' – ' + hm(i * 10 + 9);
  }

  /* ---------- 校验 ---------- */
  var FPX = deobf(FP);
  function verify(pwd, seg) {
    pwd = String(pwd || '').replace(/\D/g, '');
    if (pwd.length !== 4) return false;
    var i = (seg == null) ? segIndex() : seg;
    return sha256(SALT + '|' + i + '|' + pwd).slice(0, 32) === FPX.substr(i * 32, 32);
  }

  function passed() {
    try {
      var t = parseInt(window.localStorage.getItem('xrh_gate_ts') || '0', 10);
      return !!t && (Date.now() - t) < TTL;
    } catch (e) { return false; }
  }
  function mark() {
    try { window.localStorage.setItem('xrh_gate_ts', String(Date.now())); } catch (e) {}
  }

  /* 供自检 / 调试使用 */
  window.XRHGate = { verify: verify, segIndex: segIndex, segText: segText, ttl: TTL };

  if (passed()) return;

  /* ---------- 样式 ---------- */
  var CSS = [
    '.gate-pending .phone,.gate-pending body>*{visibility:hidden}',
    '#xrh-gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;',
    'background:linear-gradient(160deg,#0E3A2F,#12463A 55%,#1B5E48);font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}',
    '#xrh-gate .g-box{width:300px;padding:26px 22px 22px;border-radius:18px;background:rgba(255,255,255,.97);',
    'box-shadow:0 18px 48px rgba(0,0,0,.32);text-align:center;position:relative}',
    '#xrh-gate .g-logo{width:44px;height:44px;border-radius:12px;margin:0 auto 12px;background:linear-gradient(140deg,#12463A,#2A7A5C);',
    'color:#E8CE8C;font-size:20px;font-weight:900;line-height:44px;letter-spacing:1px}',
    '#xrh-gate .g-t{font-size:16px;font-weight:800;color:#1B2B26}',
    '#xrh-gate .g-s{font-size:12.5px;color:#7A8784;margin-top:5px;line-height:1.6}',
    '#xrh-gate .g-seg{display:inline-block;margin:11px 0 13px;padding:5px 12px;border-radius:999px;background:#F1F5F3;',
    'font-size:12px;color:#12463A;font-weight:700;letter-spacing:.3px}',
    '#xrh-gate .g-inp{display:flex;gap:9px;justify-content:center}',
    '#xrh-gate .g-inp input{width:52px;height:56px;border:1.5px solid #DDE4E1;border-radius:12px;background:#FBFCFB;',
    'font-size:24px;font-weight:800;text-align:center;color:#1B2B26;outline:none;transition:.18s}',
    '#xrh-gate .g-inp input:focus{border-color:#12463A;background:#fff;box-shadow:0 0 0 3px rgba(18,70,58,.1)}',
    '#xrh-gate .g-err{height:16px;margin-top:9px;font-size:12px;color:#C0342A;font-weight:600}',
    '#xrh-gate .g-btn{margin-top:6px;width:100%;height:44px;border:0;border-radius:12px;background:#12463A;color:#fff;',
    'font-size:15px;font-weight:800;letter-spacing:1px;cursor:pointer}',
    '#xrh-gate .g-btn:active{transform:scale(.98)}',
    '#xrh-gate .g-foot{margin-top:12px;font-size:11px;color:#9AA5A2;line-height:1.6}',
    '#xrh-gate.shake .g-box{animation:gshake .34s}',
    '@keyframes gshake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(4px)}}'
  ].join('');

  var st = document.createElement('style');
  st.setAttribute('data-xrh-gate', '');
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);
  document.documentElement.classList.add('gate-pending');

  function mount() {
    var box = document.createElement('div');
    box.id = 'xrh-gate';
    box.innerHTML =
      '<div class="g-box">' +
        '<div class="g-logo">禾</div>' +
        '<div class="g-t">湘仁禾会员 APP</div>' +
        '<div class="g-s">请输入<b>当前时段</b>对应的 4 位访问密码</div>' +
        '<div class="g-seg" id="g-seg"></div>' +
        '<div class="g-inp" id="g-inp">' +
          '<input inputmode="numeric" maxlength="1" autocomplete="off" aria-label="密码第1位">' +
          '<input inputmode="numeric" maxlength="1" autocomplete="off" aria-label="密码第2位">' +
          '<input inputmode="numeric" maxlength="1" autocomplete="off" aria-label="密码第3位">' +
          '<input inputmode="numeric" maxlength="1" autocomplete="off" aria-label="密码第4位">' +
        '</div>' +
        '<div class="g-err" id="g-err"></div>' +
        '<button class="g-btn" id="g-btn">进 入</button>' +
        '<div class="g-foot">密码每 10 分钟更换一次 · 请向管理员索取密码表</div>' +
      '</div>';
    (document.body || document.documentElement).appendChild(box);
    document.documentElement.classList.remove('gate-pending');

    var seg = document.getElementById('g-seg');
    var err = document.getElementById('g-err');
    var inputs = [].slice.call(box.querySelectorAll('.g-inp input'));

    function syncSeg() { seg.textContent = '当前时段 ' + segText(segIndex()); }
    syncSeg();
    setInterval(syncSeg, 20000);

    function val() { return inputs.map(function (i) { return i.value; }).join(''); }
    function clear() {
      inputs.forEach(function (i) { i.value = ''; });
      inputs[0].focus();
    }

    inputs.forEach(function (inp, i) {
      inp.addEventListener('input', function () {
        inp.value = inp.value.replace(/\D/g, '').slice(-1);
        if (inp.value && i < 3) inputs[i + 1].focus();
        if (val().length === 4) submit();
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !inp.value && i > 0) { inputs[i - 1].focus(); e.preventDefault(); }
        if (e.key === 'Enter') submit();
        if (e.key === 'ArrowLeft' && i > 0) inputs[i - 1].focus();
        if (e.key === 'ArrowRight' && i < 3) inputs[i + 1].focus();
      });
      inp.addEventListener('paste', function (e) {
        e.preventDefault();
        var t = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 4);
        for (var k = 0; k < t.length; k++) inputs[k].value = t.charAt(k);
        inputs[Math.min(t.length, 3)].focus();
        if (val().length === 4) submit();
      });
    });

    function reloadFrames() {
      /* 总览页（sitemap.html）内嵌 iframe 子页同样受门禁保护，
         主页面验证通过后刷新子框架，使其读到通过标记而不再弹锁屏 */
      try {
        var fs = document.querySelectorAll('iframe');
        for (var i = 0; i < fs.length; i++) {
          var s = fs[i].getAttribute('src');
          if (s) fs[i].setAttribute('src', s);
        }
      } catch (e) {}
    }

    function submit() {
      var v = val();
      if (v.length < 4) { err.textContent = '请输入 4 位数字密码'; return; }
      if (verify(v)) {
        mark();
        box.remove();
        st.remove();
        reloadFrames();
      } else {
        err.textContent = '密码不正确，请对照当前时段重新输入';
        box.classList.remove('shake');
        void box.offsetWidth;
        box.classList.add('shake');
        clear();
      }
    }

    document.getElementById('g-btn').addEventListener('click', submit);
    setTimeout(function () { inputs[0].focus(); }, 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
'''


def main():
    md = sys.argv[1] if len(sys.argv) > 1 else None
    if not md or not os.path.isfile(md):
        raise SystemExit('用法: python scripts/gen_gate.py <密码表.md>')
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, 'assets', 'gate.js')

    pwds = parse_table(md)
    fp = ''.join(fingerprint(p, i) for i, p in enumerate(pwds))
    assert len(fp) == 144 * 32

    js = (TEMPLATE
          .replace('__SALT__', SALT)
          .replace('__TTL__', '2 * 60 * 60 * 1000')
          .replace('__FP__', obfuscate(fp)))
    io.open(out, 'w', encoding='utf-8', newline='\n').write(js)

    # 在所有页面 head 注入引用
    added, skipped = [], []
    for name in sorted(os.listdir(root)):
        if not name.endswith('.html'):
            continue
        p = os.path.join(root, name)
        html = io.open(p, encoding='utf-8').read()
        if 'assets/gate.js' in html:
            skipped.append(name)
            continue
        if 'assets/style.css' in html:
            html = html.replace('<link rel="stylesheet" href="assets/style.css">',
                                '<link rel="stylesheet" href="assets/style.css">\n<script src="assets/gate.js"></script>', 1)
        else:
            html = html.replace('<head>', '<head>\n<script src="assets/gate.js"></script>', 1)
        io.open(p, 'w', encoding='utf-8', newline='\n').write(html)
        added.append(name)

    print('指纹已生成：%s（%d 段）' % (out, 144))
    print('注入页面：%d 个%s' % (len(added), ('' if not added else ' → ' + ', '.join(added))))
    if skipped:
        print('已存在引用跳过：%d 个' % len(skipped))


if __name__ == '__main__':
    main()
