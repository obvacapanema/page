(function(){
  'use strict';
  var C = window.CONFIG || {};

  // aceita só https:// e, quando pedido, só hosts permitidos (alinhado à CSP do index.html)
  function safeUrl(u, hosts){
    try{
      var x = new URL(String(u));
      if(x.protocol !== 'https:') return '';
      if(hosts && hosts.indexOf(x.hostname) === -1) return '';
      return x.href;
    }catch(e){ return ''; }
  }
  function safeEmail(e){ return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(String(e||'')) ? String(e) : ''; }

  // botões que dependem de link (formulários, boletim, e-mail)
  document.querySelectorAll('[data-cfg]').forEach(function(a){
    var k = a.getAttribute('data-cfg'), v;
    v = (k === 'email') ? safeEmail(C.email) : safeUrl(C[k]);
    if(v){
      if(k === 'email'){
        var su = encodeURIComponent(a.getAttribute('data-subject') || '');
        var cel = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (window.matchMedia && matchMedia('(pointer:coarse)').matches);
        if(cel){ a.href = 'mailto:' + v + '?subject=' + su; }   // celular: abre o app de e-mail
        else { a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(v) + '&su=' + su; a.target = '_blank'; a.rel = 'noopener noreferrer'; }   // computador: Gmail na web
      }
      else { a.href = v; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    } else {
      a.className = a.className + ' disabled';
      a.removeAttribute('href');
      a.textContent = a.getAttribute('data-soon');
      a.setAttribute('aria-disabled', 'true');
    }
  });

  // selo de cada segmento: "Respostas abertas" se algum formulário tem link
  document.querySelectorAll('.seg').forEach(function(seg){
    if(seg.querySelector('a[data-cfg]:not(.disabled)')){
      var st = seg.querySelector('.seg-st'); st.textContent = 'Respostas abertas'; st.classList.add('on');
    }
  });

  // painel incorporado (opcional)
  var painel = safeUrl(C.painelUrl, ['lookerstudio.google.com', 'app.powerbi.com']);
  var frame = document.querySelector('[data-cfg-src]');
  if(frame && painel){
    frame.src = painel;
    frame.setAttribute('referrerpolicy', 'no-referrer');
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
    document.getElementById('painel').hidden = false;
  }

  // rodapé
  var fe = document.getElementById('f-email'), fi = document.getElementById('f-insta');
  var em = safeEmail(C.email), ig = safeUrl(C.instagram);
  if(em){ fe.href = 'mailto:' + em; fe.textContent = em; fe.hidden = false; } else if(fe.nextElementSibling){ fe.nextElementSibling.remove(); }
  document.getElementById('f-contact').hidden = !(em || ig);
  if(ig){ fi.href = ig; fi.target = '_blank'; fi.rel = 'noopener noreferrer'; fi.hidden = false; }

  // rolagem suave (e foco para teclado/leitor de tela)
  document.querySelectorAll('[data-go]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var el = document.getElementById(a.getAttribute('data-go'));
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // aparecer ao rolar + animar barras
  var fills = document.querySelectorAll('.fill');
  function grow(){ fills.forEach(function(f){ f.style.width = f.getAttribute('data-w') + '%'; }); }
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(function(r){ r.classList.add('in'); });
    grow(); return;
  }
  // contagem animada dos números (o texto original continua no HTML se o JS falhar)
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function count(el){
    var txt = el.textContent, m = txt.match(/^(\d+)(.*)$/);
    if(!m || calm){ return; }
    var to = parseInt(m[1], 10), suf = m[2], dur = 1400, t0 = null;
    el.textContent = '0' + suf;
    function step(t){
      if(t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e) + suf;
      if(k < 1) requestAnimationFrame(step); else el.textContent = txt;
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(en.isIntersecting){
        en.target.classList.add('in');
        en.target.querySelectorAll('.stat .n, .bar b').forEach(count);
        if(en.target.querySelector('.fill')) grow();
        io.unobserve(en.target);
      }
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(r){ io.observe(r); });
})();
