/* Partículas decorativas (canvas). Sem bibliotecas, sem rede. Respeita "reduzir movimento". */
(function () {
  'use strict';
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;

  var cv = document.createElement('canvas');
  cv.className = 'fx';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d');
  if (!ctx) return;

  var W = 0, H = 0, dpr = 1, P = [], raf = 0, last = 0;
  var mouse = { x: -9999, y: -9999 };
  var col = { a: '31,78,61', b: '224,165,38' };
  var LINK = 105, PUSH = 110;

  function hexToRgb(h) {
    h = (h || '').trim().replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (h.length !== 6) return null;
    return parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4), 16);
  }
  function readColors() {
    var s = getComputedStyle(document.documentElement);
    col.a = hexToRgb(s.getPropertyValue('--green-2')) || col.a;
    col.b = hexToRgb(s.getPropertyValue('--amber')) || col.b;
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(W < 700 ? 14 : 34, (W * H) / 40000));
    while (P.length < n) P.push(make());
    P.length = n;
  }
  function make() {
    var amber = Math.random() < 0.12;
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
      r: 1 + Math.random() * 1.1, c: amber ? 'b' : 'a'
    };
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min((t - last) / 16.7 || 1, 3); last = t;
    ctx.clearRect(0, 0, W, H);
    var i, j, p, q, dx, dy, d, f;
    for (i = 0; i < P.length; i++) {
      p = P[i];
      dx = p.x - mouse.x; dy = p.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < PUSH && d > 0.1) { f = (1 - d / PUSH) * 0.03; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
      p.vx *= 0.995; p.vy *= 0.995;
      var sp = Math.abs(p.vx) + Math.abs(p.vy);
      if (sp < 0.07) { p.vx += (Math.random() - 0.5) * 0.012; p.vy += (Math.random() - 0.5) * 0.012; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
    }
    for (i = 0; i < P.length; i++) {
      p = P[i];
      for (j = i + 1; j < P.length; j++) {
        q = P[j]; dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
        if (d < LINK * LINK) {
          ctx.strokeStyle = 'rgba(' + col.a + ',' + (0.07 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(' + col[p.c] + ',' + (p.c === 'b' ? 0.3 : 0.2) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
  }

  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  readColors(); size(); start();
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
  window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  var dm = window.matchMedia('(prefers-color-scheme: dark)');
  if (dm.addEventListener) dm.addEventListener('change', readColors);
  if (window.MutationObserver) new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  mq.addEventListener && mq.addEventListener('change', function () {
    if (mq.matches) { stop(); cv.remove(); }
  });
})();
