/* Painel do OBVA-Capanema: gráficos em HTML e CSS, sem bibliotecas nem rede.
   Os números vêm de dados.js. Visões: Geral (soma dos segmentos) e um painel por segmento. */
(function () {
  'use strict';
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia && window.matchMedia('(hover: none)').matches;
  var S = DADOS.segmentos, DB = DADOS.dados;
  var NIVEIS = ['Muito insatisfeito', 'Insatisfeito', 'Neutro', 'Satisfeito', 'Muito satisfeito'];
  var MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  var KPI = {
    consumidor: [
      { id: 'fisicas', t: 'compram nas lojas físicas de Capanema', go: ['canais', 'Ponto físico'] },
      { id: 'preco', t: 'dizem que o preço é o que mais pesa na escolha da loja', go: ['aval', 'Preços'] },
      { id: 'credito', t: 'já deixaram de comprar ou adiaram por falta de parcelamento ou crédito', go: ['aval', 'Condições de pagamento'] },
      { id: 'reforma', t: 'pretendem reformar ou construir nos próximos 12 meses' },
      { id: 'subiram', t: 'sentiram os preços subirem nos últimos 6 meses', go: ['aval', 'Preços'] }
    ],
    lojista: [
      { id: 'custo', t: 'lojas apontam o custo das mercadorias como a maior dificuldade', go: ['dores', 'Custo das mercadorias'] },
      { id: 'chuva', t: 'dizem que o período de chuvas reduz as vendas' },
      { id: 'junho', t: 'citam junho como um dos meses mais fortes', go: ['meses', 'Junho'] },
      { id: 'melhores', t: 'esperam vendas melhores nos próximos 6 meses' }
    ]
  };

  /* ---------- dados: escolher e somar ---------- */
  function comDados(id, aud) { return !!(DB[id] && DB[id][aud] && DB[id][aud].n > 0); }
  function segsCom(aud) { return S.filter(function (s) { return comDados(s.id, aud); }); }
  function somaLista(listas, sort) {
    var map = {}, ord = [];
    listas.forEach(function (it) { it.forEach(function (x) { if (!(x[0] in map)) { map[x[0]] = 0; ord.push(x[0]); } map[x[0]] += x[1]; }); });
    var out = ord.map(function (k) { return [k, map[k]]; });
    if (sort) out.sort(function (a, b) { return b[1] - a[1]; });
    return out;
  }
  function juntar(aud, ids) {
    var out = { n: 0, k: {}, g: {}, gb: {}, segs: ids.length, ids: ids };
    var parts = ids.map(function (id) { return DB[id][aud]; });
    parts.forEach(function (d) {
      out.n += d.n;
      Object.keys(d.k || {}).forEach(function (k) {
        if (!out.k[k]) out.k[k] = [0, 0];
        out.k[k][0] += d.k[k][0]; out.k[k][1] += d.k[k][1];
      });
    });
    ['pagto', 'canais', 'gasto', 'dores', 'vcanais', 'vpagto'].forEach(function (c) {
      var ls = [], b = 0;
      parts.forEach(function (d) { if (d.g && d.g[c]) { ls.push(d.g[c]); b += d.n; } });
      if (ls.length) { out.g[c] = somaLista(ls, c !== 'gasto'); out.gb[c] = b; }
    });
    var av = {}, avo = [];
    parts.forEach(function (d) {
      if (d.g && d.g.aval) d.g.aval.forEach(function (r) {
        if (!av[r[0]]) { av[r[0]] = [0, 0, 0, 0, 0]; avo.push(r[0]); }
        r[1].forEach(function (x, i) { av[r[0]][i] += x; });
      });
    });
    if (avo.length) out.g.aval = avo.map(function (k) { return [k, av[k]]; });
    var ms = {};
    parts.forEach(function (d) {
      if (d.g && d.g.meses) d.g.meses.forEach(function (r) { if (!ms[r[0]]) ms[r[0]] = [0, 0]; ms[r[0]][0] += r[1]; ms[r[0]][1] += r[2]; });
    });
    var mk = Object.keys(ms).sort(function (a, b) { return MESES.indexOf(a) - MESES.indexOf(b); });
    if (mk.length) { out.g.meses = mk.map(function (m) { return [m, ms[m][0], ms[m][1]]; }); out.gb.meses = out.n; }
    if (ids.length === 1) {
      var d0 = parts[0]; out.perfil = d0.perfil; out.notas = d0.notas;
      Object.keys(out.g).forEach(function (c) { if (c !== 'aval') out.gb[c] = d0.n; });
    }
    return out;
  }
  function obter(view, aud) {
    if (view === 'geral') { var ids = segsCom(aud).map(function (s) { return s.id; }); return ids.length ? juntar(aud, ids) : null; }
    return comDados(+view, aud) ? juntar(aud, [+view]) : null;
  }

  /* ---------- utilidades ---------- */
  var unit = '%', updaters = [], reg = {};
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pct(v, base) { return base ? Math.round(v / base * 100) : 0; }
  function plural(n, s, p) { return n + ' ' + (n === 1 ? s : p); }
  function card(title, sub) { var c = el('article', 'card d-card'); c.appendChild(el('h3', null, title)); if (sub) c.appendChild(el('p', 'd-sub', sub)); return c; }
  function grow(fill, w) {
    if (calm) { fill.style.width = w + '%'; return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = w + '%'; }); });
  }

  /* ---------- dica flutuante ---------- */
  var tip = el('div', 'd-tip'); tip.setAttribute('role', 'presentation');
  var tipT = el('strong'), tipB = el('span'); tip.appendChild(tipT); tip.appendChild(tipB); document.body.appendChild(tip);
  var tipTimer = 0;
  function placeTip(x, y) {
    var w = tip.offsetWidth, h = tip.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
    var left = Math.min(Math.max(8, x - w / 2), vw - w - 8), top = y - h - 14;
    if (top < 8) top = Math.min(y + 18, vh - h - 8);
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function showTip(title, body, x, y, auto) {
    tipT.textContent = title; tipB.textContent = body; tip.classList.add('on'); placeTip(x, y);
    clearTimeout(tipTimer); if (auto) tipTimer = setTimeout(hideTip, auto);
  }
  function hideTip() { tip.classList.remove('on'); clearTimeout(tipTimer); }
  function anchor(n) { var r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + Math.min(r.height / 2, 24)]; }
  document.addEventListener('pointerdown', function (e) { if (!e.target.closest || !e.target.closest('[data-tip]')) hideTip(); });
  window.addEventListener('scroll', hideTip, { passive: true });

  function wire(cfg) {
    var n = cfg.node, box = cfg.box;
    n.setAttribute('data-tip', '1'); n.tabIndex = 0; n.setAttribute('role', 'button'); n.setAttribute('aria-pressed', 'false');
    function on() { box.classList.add('focus'); n.classList.add('act'); }
    function off() { if (box._pin !== n) { n.classList.remove('act'); if (!box._pin) box.classList.remove('focus'); } }
    n.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { on(); showTip(cfg.title, cfg.body(), e.clientX, e.clientY); } });
    n.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') placeTip(e.clientX, e.clientY); });
    n.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { off(); hideTip(); } });
    n.addEventListener('focus', function () { on(); var p = anchor(n); showTip(cfg.title, cfg.body(), p[0], p[1]); });
    n.addEventListener('blur', function () { off(); hideTip(); });
    n.addEventListener('click', function (e) {
      var was = box._pin === n;
      if (box._pin) { box._pin.classList.remove('act'); box._pin.setAttribute('aria-pressed', 'false'); }
      box._pin = null; box.classList.remove('focus');
      if (!was) {
        box._pin = n; n.classList.add('act'); n.setAttribute('aria-pressed', 'true'); box.classList.add('focus');
        if (cfg.detail) cfg.detail(cfg.detailText());
        if (e.pointerType === 'touch' || coarse || e.detail === 0) { var p = anchor(n); showTip(cfg.title, cfg.body(), p[0], p[1], 2600); }
      } else { if (cfg.detail) cfg.detail(null); hideTip(); }
    });
    n.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); n.click(); } });
    n._pinTo = function () { if (box._pin !== n) n.click(); };
  }
  function detailBox(c, hint) {
    var d = el('p', 'd-detail', hint); d.setAttribute('aria-live', 'polite'); c.appendChild(d);
    return function (t) { d.textContent = t || hint; d.classList.toggle('on', !!t); };
  }
  var HINT = coarse ? 'Toque numa barra para ver os detalhes.' : 'Passe o mouse ou clique numa barra para ver os detalhes.';

  /* ---------- componentes ---------- */
  /* itens: [rótulo, valor, base?]; kind: 'p' pessoas, 'l' lojas, 'c' contagem simples */
  function bars(items, base, kind, color, key, parent) {
    var box = el('div', 'd-bars'), rows = [], setDetail = detailBox(parent, HINT);
    var maxv = Math.max.apply(null, items.map(function (i) { return i[1]; })) || 1;
    var order = items.map(function (it, i) { return [it[1], i]; }).sort(function (a, b) { return b[0] - a[0]; });
    var rank = {}; order.forEach(function (o, r) { rank[o[1]] = r + 1; });
    items.forEach(function (it, i) {
      var b = it[2] || base, row = el('div', 'd-row');
      row.appendChild(el('span', 'd-lab', it[0]));
      var tr = el('span', 'd-track'), fl = el('span', 'd-fill' + (color ? ' ' + color : '')); tr.appendChild(fl); row.appendChild(tr);
      var val = el('b', 'd-val'); row.appendChild(val);
      function txt() { if (kind === 'c') return String(it[1]); return (kind === 'p' && unit === '%') ? pct(it[1], b) + '%' : it[1] + ' de ' + b; }
      function long() {
        if (kind === 'c') return plural(it[1], 'resposta', 'respostas');
        return it[1] + ' de ' + b + ' ' + (kind === 'p' ? 'pessoas (' + pct(it[1], b) + '%)' : 'lojas') + ' · ' + rank[i] + 'º de ' + items.length;
      }
      function paint() { val.textContent = txt(); row.setAttribute('aria-label', it[0] + ': ' + txt()); }
      paint(); if (kind === 'p') updaters.push(paint);
      box.appendChild(row); rows.push(row);
      grow(fl, kind === 'c' ? it[1] / maxv * 100 : it[1] / b * 100);
      wire({ box: box, node: row, title: it[0], body: long, detail: setDetail, detailText: function () { return it[0] + ': ' + long() + '.'; } });
    });
    parent.appendChild(box); parent.appendChild(parent.querySelector('.d-detail'));
    var r = { card: parent, rows: rows, items: items }; if (key) reg[key] = r;
    return box;
  }
  function cardBars(title, sub, items, base, kind, color, key) { var c = card(title, sub); bars(items, base, kind, color, key, c); return c; }

  function kpis(list) {
    var g = el('div', 'd-kpis');
    list.forEach(function (k) {
      var c = el('div', 'card stat d-kpi'), n = el('div', 'n', k.txt);
      n.setAttribute('data-n', k.n); n.setAttribute('data-s', k.s); c.appendChild(n); c.appendChild(el('p', null, k.t));
      if (k.go) {
        c.classList.add('go'); c.tabIndex = 0; c.setAttribute('role', 'button');
        c.setAttribute('aria-label', k.txt + ' ' + k.t + '. Ver no gráfico.'); c.appendChild(el('span', 'd-go', 'Ver no gráfico ↓'));
        var go = function () { goTo(k.go[0], k.go[1]); };
        c.addEventListener('click', go);
        c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      }
      g.appendChild(c);
    });
    return g;
  }
  function goTo(key, label) {
    var r = reg[key]; if (!r) return;
    r.card.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
    r.card.classList.remove('flash'); void r.card.offsetWidth; r.card.classList.add('flash');
    setTimeout(function () { r.card.classList.remove('flash'); }, 1800);
    var idx = -1; (r.items || []).forEach(function (it, i) { if (it[0] === label) idx = i; });
    if (idx >= 0 && r.rows[idx]) setTimeout(function () { r.rows[idx]._pinTo(); }, calm ? 0 : 450);
  }
  function count(n) {
    if (calm) return;
    var to = +n.getAttribute('data-n'), s = n.getAttribute('data-s'), t0 = null; n.textContent = '0' + s;
    function step(t) { if (t0 === null) t0 = t; var k = Math.min((t - t0) / 1200, 1), e = 1 - Math.pow(1 - k, 3); n.textContent = Math.round(to * e) + s; if (k < 1) requestAnimationFrame(step); else n.textContent = to + s; }
    requestAnimationFrame(step);
  }
  function unitToggle() {
    var w = el('div', 'd-unit'); w.setAttribute('role', 'group'); w.setAttribute('aria-label', 'Mostrar valores em');
    w.appendChild(el('span', null, 'Mostrar valores em:'));
    [['%', 'Porcentagem'], ['n', 'Pessoas']].forEach(function (o) {
      var b = el('button', 'd-u', o[1]); b.type = 'button'; b.setAttribute('aria-pressed', o[0] === unit ? 'true' : 'false');
      b.addEventListener('click', function () {
        unit = o[0]; w.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        updaters.forEach(function (f) { f(); });
      });
      w.appendChild(b);
    });
    return w;
  }

  function satisf(aval) {
    var c = card('Como o consumidor avalia o comércio local', 'Percentual de respostas em cada nível. À direita, o saldo: satisfeitos menos insatisfeitos.');
    var box = el('div', 'd-stacks'), rows = [], setDetail;
    var leg = el('div', 'd-leg'); leg.setAttribute('role', 'group'); leg.setAttribute('aria-label', 'Filtrar por nível de satisfação');
    NIVEIS.forEach(function (nm, i) {
      var b = el('button', 'd-leg-i'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('i', 's' + (i + 1))); b.appendChild(document.createTextNode(nm));
      b.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !leg._pin) box.setAttribute('data-lf', i + 1); });
      b.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !leg._pin) box.removeAttribute('data-lf'); });
      b.addEventListener('click', function () {
        var was = leg._pin === b;
        leg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        leg._pin = null; box.removeAttribute('data-lf');
        if (!was) { leg._pin = b; b.setAttribute('aria-pressed', 'true'); box.setAttribute('data-lf', i + 1); }
      });
      leg.appendChild(b);
    });
    c.appendChild(leg);
    aval.forEach(function (a) {
      var v = a[1], tot = v.reduce(function (s, x) { return s + x; }, 0), saldo = pct(v[3] + v[4] - v[0] - v[1], tot);
      var row = el('div', 'd-srow'); row.appendChild(el('span', 'd-lab', a[0]));
      var bar = el('span', 'd-stack');
      v.forEach(function (x, i) {
        if (!x) return;
        var seg = el('span', 'sg s' + (i + 1)); seg.style.flexGrow = x; seg.setAttribute('data-tip', '1');
        function body() { return plural(x, 'pessoa', 'pessoas') + ' (' + pct(x, tot) + '%)'; }
        seg.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') showTip(a[0] + ' · ' + NIVEIS[i], body(), e.clientX, e.clientY); });
        seg.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') placeTip(e.clientX, e.clientY); });
        seg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hideTip(); });
        seg.addEventListener('click', function (e) { e.stopPropagation(); if (e.pointerType === 'touch' || coarse) { var p = anchor(seg); showTip(a[0] + ' · ' + NIVEIS[i], body(), p[0], p[1], 2600); } });
        function paintSeg() { seg.textContent = pct(x, tot) >= 9 ? (unit === '%' ? pct(x, tot) + '%' : String(x)) : ''; }
        paintSeg(); updaters.push(paintSeg); bar.appendChild(seg);
      });
      row.appendChild(bar); row.appendChild(el('b', 'd-saldo ' + (saldo >= 0 ? 'pos' : 'neg'), (saldo > 0 ? '+' : '') + saldo));
      row.setAttribute('aria-label', a[0] + ': ' + NIVEIS.map(function (nm, i) { return nm + ' ' + pct(v[i], tot) + '%'; }).join(', ') + '. Saldo ' + (saldo > 0 ? '+' : '') + saldo + ' pontos.');
      box.appendChild(row); rows.push(row);
      row._g = { nome: a[0], sat: pct(v[3] + v[4], tot), neu: pct(v[2], tot), ins: pct(v[0] + v[1], tot), saldo: saldo };
    });
    c.appendChild(box);
    setDetail = detailBox(c, coarse ? 'Toque numa barra para ver o resumo. Toque na legenda para filtrar um nível.' : 'Clique numa linha para ver o resumo. Passe o mouse ou clique na legenda para filtrar um nível.');
    rows.forEach(function (row) {
      var g = row._g;
      wire({ box: box, node: row, title: g.nome, body: function () { return g.sat + '% satisfeitos · ' + g.neu + '% neutros · ' + g.ins + '% insatisfeitos'; }, detail: setDetail,
        detailText: function () { return g.nome + ': ' + g.sat + '% satisfeitos, ' + g.neu + '% neutros e ' + g.ins + '% insatisfeitos. Saldo de ' + (g.saldo > 0 ? '+' : '') + g.saldo + ' pontos (' + (g.saldo > 0 ? 'mais elogios que queixas' : g.saldo < 0 ? 'mais queixas que elogios' : 'empate') + ').'; } });
    });
    reg.aval = { card: c, rows: rows, items: aval };
    return c;
  }

  function meses(ms, L) {
    var c = card('Meses fortes e fracos', 'Quantas lojas citaram cada mês.');
    var leg = el('div', 'd-leg');
    [['forte', 'Citado como forte'], ['fraco', 'Citado como fraco']].forEach(function (x) { var li = el('span', 'd-leg-i'); li.appendChild(el('i', x[0])); li.appendChild(document.createTextNode(x[1])); leg.appendChild(li); });
    c.appendChild(leg);
    var box = el('div', 'd-bars'), rows = [], setDetail = detailBox(c, coarse ? 'Toque num mês para ver o detalhe.' : 'Passe o mouse ou clique num mês para ver o detalhe.');
    var mx = Math.max.apply(null, ms.map(function (m) { return Math.max(m[1], m[2]); })) || 1, ref = Math.max(L, mx);
    ms.forEach(function (m) {
      var row = el('div', 'd-row d-row2');
      row.setAttribute('aria-label', m[0] + ': forte em ' + m[1] + ' de ' + L + ' lojas, fraco em ' + m[2]);
      row.appendChild(el('span', 'd-lab', m[0]));
      var pair = el('span', 'd-pair');
      [[m[1], 'forte'], [m[2], 'fraco']].forEach(function (x) { var tr = el('span', 'd-track'), fl = el('span', 'd-fill ' + x[1]); tr.appendChild(fl); pair.appendChild(tr); grow(fl, x[0] / ref * 100); });
      row.appendChild(pair); row.appendChild(el('b', 'd-val', m[1] + ' · ' + m[2]));
      box.appendChild(row); rows.push(row);
      function body() { return 'Forte em ' + m[1] + ' de ' + L + ' lojas · fraco em ' + m[2]; }
      wire({ box: box, node: row, title: m[0], body: body, detail: setDetail,
        detailText: function () { return m[0] + ': ' + body().toLowerCase() + '. ' + (m[1] > m[2] ? 'Mês de venda forte.' : m[2] > m[1] ? 'Mês de venda fraca.' : 'Sem tendência clara.'); } });
    });
    c.appendChild(box); c.appendChild(c.querySelector('.d-detail'));
    reg.meses = { card: c, rows: rows, items: ms }; return c;
  }

  function note(title, items) {
    var c = el('aside', 'card d-note'); c.appendChild(el('h3', null, title));
    var ul = el('ul'); items.forEach(function (t) { ul.appendChild(el('li', null, t)); }); c.appendChild(ul); return c;
  }
  function grid(cols) { var g = el('div', 'd-grid'); cols.filter(Boolean).forEach(function (c) { g.appendChild(c); }); return g; }

  /* frases automáticas, quando o segmento não traz as suas */
  function auto(aud, d) {
    var out = [], g = d.g;
    function topo(c, quem) { if (g[c] && g[c].length) { var t = g[c][0], b = d.gb[c]; out.push(quem + ': ' + t[0] + ' (' + (aud === 'consumidor' ? pct(t[1], b) + '%' : t[1] + ' de ' + b) + ').'); } }
    if (aud === 'consumidor') {
      topo('pagto', 'Forma de pagamento mais citada'); topo('canais', 'Canal onde mais descobrem ofertas');
      if (d.k.credito) out.push(pct(d.k.credito[0], d.k.credito[1]) + '% já deixaram de comprar ou adiaram por falta de crédito ou parcelamento.');
      if (g.aval && g.aval.length) {
        var sc = g.aval.map(function (a) { var t = a[1].reduce(function (s, x) { return s + x; }, 0); return [a[0], pct(a[1][3] + a[1][4] - a[1][0] - a[1][1], t)]; }).sort(function (x, y) { return y[1] - x[1]; });
        out.push('Melhor avaliado: ' + sc[0][0] + ' (saldo ' + (sc[0][1] > 0 ? '+' : '') + sc[0][1] + '). Pior avaliado: ' + sc[sc.length - 1][0] + ' (saldo ' + (sc[sc.length - 1][1] > 0 ? '+' : '') + sc[sc.length - 1][1] + ').');
      }
    } else {
      topo('dores', 'Maior dificuldade'); topo('vcanais', 'Canal de venda mais usado');
      if (g.meses && g.meses.length) {
        var f = g.meses.slice().sort(function (a, b) { return b[1] - a[1]; })[0], w = g.meses.slice().sort(function (a, b) { return b[2] - a[2]; })[0];
        if (f[1] > 0) out.push('Mês mais citado como forte: ' + f[0] + ' (' + f[1] + ').');
        if (w[2] > 0) out.push('Mês mais citado como fraco: ' + w[0] + ' (' + w[2] + ').');
      }
    }
    return out.length ? out : ['Os destaques aparecem aqui quando houver dados.'];
  }

  /* ---------- montagem de cada visão ---------- */
  var viewAtual = 'geral', audAtual = 'consumidor';
  function nomeView(v) { if (v === 'geral') return 'Geral'; var s = S.filter(function (x) { return x.id === +v; })[0]; return s ? s.nome : ''; }

  function vazio(root, view, aud) {
    var c = el('article', 'card d-card d-empty');
    c.appendChild(el('h3', null, 'Ainda não há respostas aqui'));
    c.appendChild(el('p', 'd-sub', view === 'geral' ? 'Quando os primeiros questionários de ' + (aud === 'consumidor' ? 'consumidores' : 'lojistas') + ' forem enviados, o painel geral aparece automaticamente.' : 'O segmento "' + nomeView(view) + '" ainda não tem respostas de ' + (aud === 'consumidor' ? 'consumidores' : 'lojistas') + '. Os gráficos aparecem assim que os dados forem enviados.'));
    var a = el('a', 'btn btn-primary btn-sm', 'Participar da pesquisa →'); a.href = 'index.html#participe'; c.appendChild(a);
    root.appendChild(c);
  }

  function resumoGeral(root, aud, d) {
    var tot = S.length, k = d.segs;
    var lista = [
      { n: d.n, s: '', txt: String(d.n), t: aud === 'consumidor' ? 'consumidores responderam' : 'lojas responderam' },
      { n: k, s: ' de ' + tot, txt: k + ' de ' + tot, t: k === tot ? 'segmentos com respostas' : 'segmentos já têm respostas' }
    ];
    root.appendChild(kpis(lista));
    var porSeg = segsCom(aud).map(function (s) { return [s.curto, DB[s.id][aud].n]; });
    var c = null;
    if (porSeg.length >= 2) { c = card('Respostas por segmento', aud === 'consumidor' ? 'Quantos consumidores responderam em cada segmento.' : 'Quantas lojas responderam em cada segmento.'); bars(porSeg, 1, 'c', 'amber', 'porseg', c); }
    var cmp = null, def = aud === 'consumidor' ? { id: 'credito', t: 'Já deixaram de comprar ou adiaram por falta de crédito', sub: 'Porcentagem dos consumidores de cada segmento.', kind: 'p' } : { id: 'custo', t: 'Lojas que apontam o custo das mercadorias como maior dificuldade', sub: 'Lojas de cada segmento.', kind: 'l' };
    var itens = segsCom(aud).filter(function (s) { return DB[s.id][aud].k && DB[s.id][aud].k[def.id]; }).map(function (s) { var kk = DB[s.id][aud].k[def.id]; return [s.curto, kk[0], kk[1]]; });
    if (itens.length >= 2) { cmp = card('Comparando segmentos: ' + def.t.toLowerCase(), def.sub); bars(itens, 1, def.kind === 'p' ? 'p' : 'l', '', 'cmp', cmp); }
    if (c || cmp) root.appendChild(grid([c, cmp]));
  }

  function montar(view, aud) {
    viewAtual = view; audAtual = aud; reg = {}; updaters = []; hideTip();
    var root = document.getElementById('painel'); root.textContent = '';
    var d = obter(view, aud);
    if (!d) { vazio(root, view, aud); return; }
    if (view === 'geral') resumoGeral(root, aud, d);

    var kk = KPI[aud].filter(function (k) { return d.k[k.id]; }).map(function (k) {
      var v = d.k[k.id], isP = aud === 'consumidor';
      return { id: k.id, t: k.t, go: k.go, n: isP ? pct(v[0], v[1]) : v[0], s: isP ? '%' : ' de ' + v[1], txt: isP ? pct(v[0], v[1]) + '%' : v[0] + ' de ' + v[1] };
    });
    kk.forEach(function (k) { if (k.go && !(d.g[k.go[0]])) k.go = null; });
    if (kk.length) root.appendChild(kpis(kk));

    var base = view === 'geral' ? 'Base: ' + d.n + (aud === 'consumidor' ? ' consumidores' : ' lojas') + ' em ' + plural(d.segs, 'segmento', 'segmentos') + '.' : 'Base: ' + d.n + (aud === 'consumidor' ? ' consumidores' : ' lojas') + (d.perfil ? '; ' + d.perfil : '') + '.';
    var aviso = aud === 'lojista' ? ' Amostra pequena: use como pista, não como retrato de todo o comércio.' : ' Toque ou clique nos cartões e nos gráficos para explorar.';
    root.appendChild(el('p', 'fine', base + aviso));

    var g = d.g, notas = d.notas || auto(aud, d);
    var titulo = view === 'geral' ? 'O que se vê no conjunto' : 'O que isso quer dizer';
    if (aud === 'consumidor') {
      root.appendChild(unitToggle());
      root.appendChild(grid([
        g.pagto && cardBars('Como o consumidor paga', 'Cada pessoa pôde marcar mais de uma forma.', g.pagto, d.gb.pagto, 'p', '', 'pagto'),
        g.canais && cardBars('Onde descobre ofertas', 'Canais citados pelos consumidores.', g.canais, d.gb.canais, 'p', 'amber', 'canais')
      ]));
      if (g.aval) root.appendChild(satisf(g.aval));
      root.appendChild(grid([
        g.gasto && cardBars('Quanto gastou nos últimos 12 meses', 'Faixas de gasto em compras do segmento.', g.gasto, d.gb.gasto, 'p', '', 'gasto'),
        note(titulo, notas)
      ]));
    } else {
      root.appendChild(grid([
        g.dores && cardBars('Maiores dificuldades', 'Quantas lojas citaram cada uma.', g.dores, d.gb.dores, 'l', '', 'dores'),
        g.vcanais && cardBars('Como vende e divulga', 'Canais usados pelas lojas.', g.vcanais, d.gb.vcanais, 'l', 'amber', 'vcanais')
      ]));
      root.appendChild(grid([
        g.meses && meses(g.meses, d.n),
        g.vpagto && cardBars('Meios de pagamento aceitos', 'O que as lojas aceitam no balcão.', g.vpagto, d.gb.vpagto, 'l', '', 'vpagto')
      ]));
      root.appendChild(note(titulo, notas));
    }
    root.querySelectorAll('.d-kpi .n').forEach(count);
  }

  /* ---------- navegação: visão (geral/segmentos) e público ---------- */
  var nav = document.getElementById('seg-nav');
  var visoes = [['geral', 'Geral']].concat(S.map(function (s) { return [String(s.id), s.curto]; }));
  var btns = {};
  visoes.forEach(function (v) {
    var b = el('button', 'd-pill', v[1]); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    var has = v[0] === 'geral' ? (segsCom('consumidor').length + segsCom('lojista').length > 0) : (comDados(+v[0], 'consumidor') || comDados(+v[0], 'lojista'));
    if (!has) { b.classList.add('off'); b.title = 'Ainda sem respostas'; }
    if (v[0] !== 'geral') b.setAttribute('aria-label', nomeView(v[0]) + (has ? '' : ' (ainda sem respostas)'));
    b.addEventListener('click', function () { ir(v[0], audAtual); });
    nav.appendChild(b); btns[v[0]] = b;
  });
  ['consumidor', 'lojista'].forEach(function (k) {
    var t = document.getElementById('tab-' + k);
    t.addEventListener('click', function () { ir(viewAtual, k); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var o = k === 'consumidor' ? 'lojista' : 'consumidor'; ir(viewAtual, o); document.getElementById('tab-' + o).focus(); }
    });
  });
  function ir(view, aud) {
    Object.keys(btns).forEach(function (k) { btns[k].setAttribute('aria-pressed', k === view ? 'true' : 'false'); });
    ['consumidor', 'lojista'].forEach(function (k) { var t = document.getElementById('tab-' + k); t.setAttribute('aria-selected', k === aud ? 'true' : 'false'); t.tabIndex = k === aud ? 0 : -1; });
    montar(view, aud);
    try { history.replaceState(null, '', '#' + view + (aud === 'lojista' ? '/lojista' : '')); } catch (e) {}
  }
  (function () {
    var x0 = null, y0 = 0;
    document.addEventListener('touchstart', function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (x0 === null) return; var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
      if (Math.abs(dx) > 90 && Math.abs(dy) < 40) { if (dx < 0 && audAtual === 'consumidor') ir(viewAtual, 'lojista'); else if (dx > 0 && audAtual === 'lojista') ir(viewAtual, 'consumidor'); }
    }, { passive: true });
  })();
  var h = (location.hash || '').slice(1).split('/'), v0 = h[0], a0 = h[1];
  if (v0 === 'lojista' || v0 === 'consumidor') { a0 = v0; v0 = 'geral'; }
  if (!btns[v0]) v0 = 'geral';
  ir(v0, a0 === 'lojista' ? 'lojista' : 'consumidor');
})();
