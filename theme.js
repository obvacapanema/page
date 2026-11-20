/* Alternador de tema claro/escuro. Lembra a escolha no navegador (se permitido). */
(function () {
  'use strict';
  var KEY = 'obva-tema', root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : ''; } catch (e) { return ''; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function current() { return root.getAttribute('data-theme') || (mq && mq.matches ? 'dark' : 'light'); }

  var s = saved();
  if (s) root.setAttribute('data-theme', s);

  function sync(btn) {
    var dark = current() === 'dark';
    btn.setAttribute('data-mode', dark ? 'dark' : 'light');
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.setAttribute('aria-label', dark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro');
    btn.title = dark ? 'Tema claro' : 'Tema escuro';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-btn');
    if (!btn) return;
    sync(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      sync(btn);
    });
    if (mq && mq.addEventListener) mq.addEventListener('change', function () { sync(btn); });
  });
})();
