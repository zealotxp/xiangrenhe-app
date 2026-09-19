/* ============================================================
   湘仁禾私域会员 APP · 前端静态原型
   共享脚本 assets/app.js
   状态栏 / 导航栏 / 底部 Tab / Toast / 弹窗 / 本地演示状态
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 图标 ---------- */
  var TAB_ICON = {
    home: '<path d="M12 3.1 2.6 11.2a1 1 0 0 0 .66 1.75H5.1v7.15c0 .55.45 1 1 1h4.1v-5.4h3.6v5.4h4.1c.55 0 1-.45 1-1v-7.15h1.84a1 1 0 0 0 .66-1.75L12 3.1z"/>',
    live: '<path d="M4.6 5.5h14.8c1 0 1.8.8 1.8 1.8v9.4c0 1-.8 1.8-1.8 1.8H4.6c-1 0-1.8-.8-1.8-1.8V7.3c0-1 .8-1.8 1.8-1.8zm4.6 3.3v6.4l5.4-3.2-5.4-3.2z"/><path d="M8.4 2.6h7.2l-1 1.6H9.4z"/><path d="M6.2 20.4h11.6v1.3H6.2z"/>',
    mall: '<path d="M4.2 7.6h15.6l-.9 12.1a1.6 1.6 0 0 1-1.6 1.5H6.7a1.6 1.6 0 0 1-1.6-1.5L4.2 7.6z"/><path d="M8.4 9.6V6.9a3.6 3.6 0 0 1 7.2 0v2.7" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    profile: '<path d="M12 12.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4zm0 1.9c-3.9 0-7 2.2-7 4.8v1.2h14v-1.2c0-2.6-3.1-4.8-7-4.8z"/>'
  };

  var TABS = [
    { k: 'home', label: '首页', href: 'home.html' },
    { k: 'live', label: '直播', href: 'live.html' },
    { k: 'mall', label: '商城', href: 'mall.html' },
    { k: 'profile', label: '我的', href: 'profile.html' }
  ];

  var SB_RIGHT =
    '<span class="sb-right">' +
    '<svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>' +
    '<svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 10.6 5.9 8.4a3 3 0 0 1 4.2 0L8 10.6zM8 5.2c-1.6 0-3.1.6-4.2 1.7L2.3 5.4A8.1 8.1 0 0 1 8 3.1c2.2 0 4.2.8 5.7 2.3l-1.5 1.5A5.9 5.9 0 0 0 8 5.2z"/></svg>' +
    '<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3.2" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/><path d="M23 4v4a2.2 2.2 0 0 0 0-4z" fill="currentColor" opacity=".45"/></svg>' +
    '</span>';

  var BACK_ICON =
    '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg>';

  /* ---------- 演示用本地状态 ---------- */
  var KEY = 'xrh_app_v1';
  var ROLE_NAME = {
    customer: '顾客', promoter: '推广员', store: '门店店长',
    city: '市代', province: '省代', hq: '总部'
  };

  function defaultUser() {
    return {
      logged: false,
      nick: '李阿姨',
      phone: '138****7621',
      bind: true,            // 是否已绑定推广员归属
      role: 'customer',      // 当前演示角色
      store: '仁和堂健康生活馆（长沙雨花店）',
      promoter: '王姐',
      city: '长沙市',
      province: '湖南省',
      points: 1260,
      balance: 38.6
    };
  }

  function getUser() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultUser();
      return Object.assign(defaultUser(), JSON.parse(raw));
    } catch (e) { return defaultUser(); }
  }

  function setUser(patch) {
    var u = Object.assign(getUser(), patch || {});
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch (e) { }
    return u;
  }

  function roleName(r) { return ROLE_NAME[r] || '顾客'; }

  /* ---------- 渲染外壳 ---------- */
  function renderStatusBar() {
    var els = document.querySelectorAll('[data-statusbar]');
    for (var i = 0; i < els.length; i++) els[i].innerHTML = '<span>9:41</span>' + SB_RIGHT;
  }

  function renderNav() {
    var navs = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < navs.length; i++) {
      var nav = navs[i];
      var back = nav.getAttribute('data-back');
      var title = nav.getAttribute('data-title') || '';
      var sub = nav.getAttribute('data-sub');
      var action = nav.getAttribute('data-action');
      var actionHref = nav.getAttribute('data-action-href') || '#';
      var left = back
        ? '<a class="nav-side" href="' + back + '">' + BACK_ICON + '</a>'
        : '<span class="nav-side"></span>';
      var right = action
        ? '<a class="nav-side" href="' + actionHref + '" style="font-size:12.5px;font-weight:700;width:auto;padding:0 8px;color:var(--brand2)">' + action + '</a>'
        : '<span class="nav-side"></span>';
      nav.innerHTML = left +
        '<div class="nav-title">' + title + (sub ? '<span class="nav-sub">' + sub + '</span>' : '') + '</div>' + right;
    }
  }

  function renderTabBar() {
    var bars = document.querySelectorAll('[data-tabbar]');
    for (var i = 0; i < bars.length; i++) {
      var bar = bars[i], active = bar.getAttribute('data-tabbar'), html = '';
      for (var j = 0; j < TABS.length; j++) {
        var t = TABS[j], on = t.k === active ? ' class="on"' : '';
        html += '<a href="' + t.href + '"' + on + '>' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">' + TAB_ICON[t.k] + '</svg>' +
          '<span>' + t.label + '</span></a>';
      }
      bar.innerHTML = html;
    }
  }

  /* ---------- Toast ---------- */
  function toast(msg, ms) {
    var host = document.querySelector('.phone') || document.body;
    var el = host.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      host.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(function () { el.classList.add('on'); });
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('on'); }, ms || 1800);
  }

  /* ---------- 弹窗 ---------- */
  function modal(opts) {
    opts = opts || {};
    var host = document.querySelector('.phone') || document.body;
    var mask = document.createElement('div');
    mask.className = 'mask';
    mask.innerHTML = '<div class="modal">' + opts.html + '</div>';
    host.appendChild(mask);
    requestAnimationFrame(function () { mask.classList.add('on'); });
    function close() {
      mask.classList.remove('on');
      setTimeout(function () { if (mask.parentNode) mask.parentNode.removeChild(mask); }, 260);
    }
    mask.addEventListener('click', function (e) {
      if (e.target === mask && opts.dismissable !== false) close();
    });
    var closers = mask.querySelectorAll('[data-close]');
    for (var i = 0; i < closers.length; i++) closers[i].addEventListener('click', close);
    return { close: close, el: mask };
  }

  /* ---------- 通用交互 ---------- */
  /* 页内 Tab 切换：<div class="chips" data-tabs="a|b|c"> + 内容 [data-pane="a"] */
  function bindTabs(scope) {
    var root = typeof scope === 'string' ? document.querySelector(scope) : scope;
    if (!root) return;
    root.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || !root.contains(chip)) return;
      var key = chip.getAttribute('data-k');
      var sib = root.querySelectorAll('.chip');
      for (var i = 0; i < sib.length; i++) sib[i].classList.remove('on');
      chip.classList.add('on');
      var panes = document.querySelectorAll('[data-pane]');
      for (var j = 0; j < panes.length; j++) {
        panes[j].classList.toggle('hide', panes[j].getAttribute('data-pane') !== key);
      }
    });
  }

  /* 单选/多选 chips */
  function bindChips(scope, single, onChange) {
    var root = typeof scope === 'string' ? document.querySelector(scope) : scope;
    if (!root) return;
    root.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip, .opt');
      if (!chip || !root.contains(chip)) return;
      if (single) {
        var sib = root.querySelectorAll('.chip.on, .opt.on');
        for (var i = 0; i < sib.length; i++) sib[i].classList.remove('on');
      }
      chip.classList.toggle('on');
      if (typeof onChange === 'function') onChange(chip);
    });
  }

  /* 展开/收起：[data-toggle] 切换 [data-fold] 的 hide */
  function bindFold(scope) {
    var root = typeof scope === 'string' ? document : (scope || document);
    var btns = root.querySelectorAll('[data-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var sel = this.getAttribute('data-toggle');
        var target = document.querySelector(sel);
        if (!target) return;
        var hidden = target.classList.toggle('hide');
        var onTxt = this.getAttribute('data-on'), offTxt = this.getAttribute('data-off');
        if (onTxt && offTxt) this.textContent = hidden ? offTxt : onTxt;
        var arrow = this.querySelector('[data-arrow]');
        if (arrow) arrow.style.transform = hidden ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }
  }

  function q(name) {
    var m = location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function init() {
    renderStatusBar();
    renderNav();
    renderTabBar();
    bindFold();
    var u = getUser();
    var hosts = document.querySelectorAll('[data-nick]');
    for (var i = 0; i < hosts.length; i++) hosts[i].textContent = u.nick;
    var pts = document.querySelectorAll('[data-points]');
    for (var j = 0; j < pts.length; j++) pts[j].textContent = u.points;
    var bal = document.querySelectorAll('[data-balance]');
    for (var k = 0; k < bal.length; k++) bal[k].textContent = u.balance.toFixed(2);
    var roles = document.querySelectorAll('[data-role]');
    for (var m = 0; m < roles.length; m++) roles[m].textContent = roleName(u.role);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  window.XRH = {
    toast: toast, modal: modal, tabs: bindTabs, chips: bindChips, fold: bindFold, q: q,
    user: getUser, save: setUser, roleName: roleName, ROLE_NAME: ROLE_NAME
  };
})();
