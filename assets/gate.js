/* ============================================================
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
  var SALT = 'XRH-GATE-2026';
  var TTL = 2 * 60 * 60 * 1000;                 /* 验证通过后免验证时长 */
  var FP = '=l>=p9klmo:><<B?;@<@mmm?>8?9??@@;<@8i<l;i=jB@l>;Alml9lDlj?<@i?>komm:n;=l=<??;:<???B?;?8<B?ln?B>8l=lD8m?>>7lo<nm99<o8m9oDliA:<79;oA8jjpo;99pok<;BCh8:nlmiACA@=nkCjA<=omk?kql;llCjjnA=k@mk;8m@l@>9mA@:inA@9lA;A:jB<o:l;Ao;:mmol>onC?:ABAh?l=>hjn?Dh<>Aq:=<A>9:;C<knnBnhAAkpm9?oq7?lmojiA:q:k<==k>l>Ch=joB=:km<?89=D9;BAl7>:kp>kokq7k@:q<?ACo<<@ml>8j<=j;j<mlml;>i<jp;l=lomkkl>BkjA<;hk@C>8jlBChm>:l:jko=lk@<?j@n:ph?:mq7j>;=@>BkB=9B=Di8@BDiinom@:o:;<l=Cpm8n>>:l:=B@>@=n:ik;C7=l>B89mB?7m:BCl<??li?l@pm:Anpm9Bmq>9A:C<@@C@8lj@pi<ooq9=;ko<>:pD@k=<=;=Akm7kn=mmjmo=:kko@@m=l?ll>Aok:=:@i:l:;?=k=<iA9lBh??kCk@9=><>BC>m<:=C@;Aknkk:ppjA:@B@9>B=>?j=Ah9op;j;mAC;j9>?lklCD:j>oA;<B;CljBkD@n;?lk?:o@jn?ml;?;p=i?9;o7jAmD9lj:nhkBB@m>??D@<;;@:n;n;lA@C<m;@pl<A;pqm>o?C7?o;A@ikCm@?mAnh?mABmAm>B:j;;<k89nm>9=>qhl@:o<j;Apii>Cq;m;oq9l9@><>>C?j<A:o=n=CC;j=ollk:<pm:;B@>jmC;=;?:Djlnknj?Bllj>=@>mAkBBl89ABhn>=;kn;@n@A9l@8<n??88kBpmnmmp7jl=om<nknij;;lk>?=;>kBmBh:Bkqj9?=lk89@q=j;m@<l9:llk:C=7:jo?7:?np8>9>n>=9??llBn?7A<=l7lkmplABo>@8jC?><;C@9mn@@@@=C?<9=<?=?l;oknn?Am9Ao@999llm@?:@?kjm@k=A:Ah:j:o8il@=i;n>qjkkCnl?9<;7;k><9<Bl?j9B?@;kooC9nBl>9;@BAmkknD8@9@o8<Bo<<m;<<?l;p?7:B<=<j@Bpll;k=>j@pm?8<@l<9AAC=A=?Bjm;nDk8::D9l9:lj>lkphAm>m=9o?B=:<=<=kk;A7jl:=8lknDj=k;oi;Bo<ji:;@:>BCl8lmmpl<?>nil@o<=9l@>9>BlAji9?<m:lp>9=nA?7><nC>j:>@mABm@m;9pn@8AmCj8?o?9lACqm?;oCmkn?mlj:o;l?:lq=il=@7A=Boh=<lAi@B>@@k9AqmA<<q;??CChnm:li@?mpii:=?<jAno9nm<>l9l<B@>@nBk9jkD=;nm;l8?Amm8knn:>:kBl?9?<=>9@D@<>l>7k>pA<@m;o:9>CCknjlph?=:o98=;D79k?A:?=:D;k9omj8B@D9m>A<lAl;>::nA;ljo<B<?kC;@;Ak>8ikpB>:9o>:::><k:;:pin<?o9lBkC8@nn>;<>p;7;ol;7l@B=klj@=ki;p@l:9?=l@mBp@jB>;?i9BB@>>:>@:mlB;nn?p7l<nm?n@>nhjlB<m9mo>iAl;n;jo>?99j@C8:kAn7l@<AjnlC=?=Ao>mmk>oj>A:@>A>pn?:?AD:mmAAj>:B?i89n@=;o?o8m:opj=l@B8<:BqhikC;l:j:=lj<n@;:>k=l=::D;?9kp8mBBo;;nA=i>o;o?9:Aq:l@;<8i=l>?;lC<i=>>BjA><A;?<;o:A@C;l?kpD;9;?<j@>p<:Ajm?7j?=m>kmCm>lAp>li>B;jl9ko<@lk=j9l:<>iABp@i=;pll>p==A>@B==:k;<?nom>9oB?89oADj;>ln>mAn=?:l<B<<>mq7Ao:qmijlm;@o>B??l;n@;lCn;j=l?@8<@@mm?<p=<A>A>k?ADljBBDl>:kn@:<lp98;mB;;m:l?;:<B@?m<<>8BCn<mm@n9n@?A9mlnl;;??m:lj@C@;9kA:An@A@8no>8;=C=:=;nB9m;A@=>j:;l>ACmhAn:<=no;<>@9:o<A;=qj>A@ljjB?A<?j><h<:lC>;j:?=n>nB8m;?Cl=<<n9All=8<:lA89jnok?=Bqi>@:mk;k<A@@oAD?l;?pi9kopm?=@;8:m>Dm<A=C7?o>li=nko8mAB=>>mmn99?lol<ln>?8;@?<8;;C@nm=D=;:?oh=>C=8?lom<8k@?;;;;lm@<CAmn;lC:=jA;>jn:=i:?kC@jon>h;?<@hionn8>m:mh<A:oh9lABi9oop:8;mni@k<@@<k?Bh9Bk<ll:Ao@Ak>=<kl:Ci9@=D<j>AB=:@m;::Akn?j;<?7m<pllikBok<m=;7>l@mijnBA9m@>l99BBmm>B=B<jnBljk9nCl:=m@9;:Bl@n9:@i;Ap=<i?:@jn<>=ji>km7=o@p;jopB><<mo<@?<<7@l>lkk<@lj;;o;iAkplik?Bn;>jkn<;BpD=9m?Di:joq7i:m@;9nlBm=9?Bh89n>=:k:q:A?pD<j::C8<Ak;9AB=l<8ABmjA:kl:A:?mhkB=ll:jC>9>lmD;mA<Cl;mlDi89Apk;np=<=B@C@jmp@kijm?ijlCq9?:?A@;Bk;7:=nCi:ol@;k9?pk8nn>>kj>Chlon=<kj:C7jlAp>><oB;m@l<hnB?<i>npD@nkBo?8;:oh:lCmhl@o=lnl=>k=j@>>ln=@kl;Bn7;jlph=<m>:?<pB<kj@;i9B?n8nBkB9AA?m;n@k<:8;<oj@lnCh=ml=j@<@C=;>pBhA<np=j><o8>n;qlm?om:<=CCk>m=A@n@=C@l>Coi==;Dj=A;m89knp;9;>=?n;@B9>9A=l8;:m?=Am=k8@;pl8m;n=;?pn:lk@@=l=?;j@;mnj9o<B@9;@Bhk?n<m8nlBml=B>@?:>pkAnm=li=nD9j=l<;:@;C:;A<D7k9B=l?ooo79@l;>==mA:@:=oj@mkm7<n:n;;om;;;omA;i@lm<imBCh=?C@@lkn>>:9C?=lA;B;ljkp<?;;p7i>l>hk:Ao;kk>ok9l<m:m?Bo7;:CD?9jkn;j?;?;@:l?hl9:A<<@==lA<k>inklA=?=@nk?@<?7>AC=;m:l<l:A<Cjl?mq8i>Am7A;l?l=k<=8j9pp@n?pl7@mn;<;m@q;k=C?:@=?Bj9nC@:n;>==n;A><m?<l8Aln=k:nknl@@>n?j<:>@k?nBj=nlD7A:BBm:>@q7;mnp8?;:l9mlm<l>@>==8A>@=mop@lmokB?9>@B;;B<@iAB;l;lA;<?i?l@:iBAm@?oC?i;=Bnj?9k@9:@Am<?o@oh?Bkn??;mpjnB?<>j>Bo;k?>@mAlkC=n<oD;?A@<>n@m=:l;A;m;<>=9j9p>9;9<m;;m<>7?BC?hnA:>98k<D9<=Cmhm<pAj?9k==:=pqlm:@n8?@lmm9;?A=<?k>i;:@<=9jpD8ioB@7k?pD=:m;>?<:p@=>j;n8?<>nik;>p:l;:Cii<<>7<m<mk:>?o8koklhm@Apm9l>;>;B;<;>joq@@j:n<9:A=<l9<?:;>oDmA?B<<?m:;<m@@;mno@p>l<@?<<Aoq;:k@q:n?pDkAkC?7<=<??;jCC:9;;D8<=nDkjBBn@:<?Ah><;@8mBlli:=m>8k?=C9nmoAkj:kD=jAmmm?;Bl=Ao>min:Cl9<k>ni@:nq?9@ol<k@<mjk==Dj89k@9no;q8@:?=8lon<8n<oA;>Apm8>A=o=m??l9:mk?7:l==ii=B>k8=m=8;nkDil<BC>;@<@7m>=m@:;nDm?mA@?;@np8nA?@?AlA>iAAml99@nmkm9kD<<kk=@?;no??o>B8j>p?=i9l?7>j>=@i9=A;m9?>>nB>A7@>lC<j:kpk9k=<lj>B>?j=kli@9mp<9Bop;i;=Aikomp>lj=l@:Akm<>okm??l:@j>ACp;??n>:<o@B=j@Cp?>?l<;8>lD?nool<;mBp;:>np>>>oo<?;<m;:<m;;m>mB<<9?q>>9=Cm;lBqhko:C::9m>mmo=?<?mo>8><nC@8B:==8k:qli?ABk??pp:k<?nk;>lm7:;;DimlnA<<>>@l;ml>i;ml>:Ao?C?9npq@kl>l?:@A=:@k<>8Aoo=7jonq@iB>m@>;@m7mk??8A=nDh;=l;9:;>A:j<?o:8l=Dh:kkCm=@p@k>:nlii=:q>>;<?8?AB<:<m=@?>>po<??nD7?9ln7n::qkn=oplAnl?jj=m<8n9A<>?mBlj8mko>9B;A8kB=qh;n>l@<>CD?<m@o>@<>=?n;=n8kkBB@?9;nk?kpq7;n?q@l<o?;n@@?k<:BBjjBnq:<;p@;>j:=?9o<>:@?opi::BplAkpn=;?oq?>9<n>8?n<8?op<>?m?@9>An;h<m:p7jj;D:?;;plm;oml::;qji:kq8:=@>=n;nC>=nBA8n>;Bl=?Cpj>?B<9iAB<h8;@nm<nBo:<<p=8i>mqjAkA<m;?><h==kD7>A>D7>jBD;<o=q>>B;qijl:C;;>B@@9lkC;n>ABmk?=@<lj;>7?ABp9>Bn;;Ak@n>kk';                 /* 144 段指纹（已混淆） */
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
