/* ===========================================================
   NOA IMPULSA · interacciones
   Script clásico (sin módulos). Todo el contenido vive en el
   HTML: esto solo lo enriquece.
   =========================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  function safe(name, fn) {
    try { fn(); } catch (e) { if (window.console) console.warn('[noa] ' + name, e); }
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  ready(function () {

    /* ---------- año en el footer ---------- */
    safe('year', function () {
      var y = document.getElementById('yr');
      if (y) y.textContent = new Date().getFullYear();
    });

    /* ---------- nav con fondo al hacer scroll ---------- */
    safe('stickyNav', function () {
      var nav = document.getElementById('nav');
      if (!nav) return;
      var tick = false;
      function upd() {
        nav.classList.toggle('is-stuck', window.scrollY > 24);
        tick = false;
      }
      upd();
      window.addEventListener('scroll', function () {
        if (!tick) { tick = true; window.requestAnimationFrame(upd); }
      }, { passive: true });
    });

    /* ---------- menú móvil ---------- */
    safe('burger', function () {
      var b = document.getElementById('burger');
      var links = document.getElementById('navLinks');
      if (!b || !links) return;

      function close() {
        links.classList.remove('is-open');
        b.setAttribute('aria-expanded', 'false');
        b.setAttribute('aria-label', 'Abrir menú');
      }
      b.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
        b.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 940) close();
      });
    });

    /* ---------- aparición suave de bloques ---------- */
    safe('reveal', function () {
      var items = [].slice.call(document.querySelectorAll('.reveal'));
      if (!items.length) return;

      function showAll() {
        items.forEach(function (el) { el.classList.add('is-in'); });
      }

      if (!('IntersectionObserver' in window)) { showAll(); return; }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });

      items.forEach(function (el) { io.observe(el); });

      /* red de seguridad: pase lo que pase, a los 2,5 s todo es visible */
      setTimeout(showAll, 2500);
    });

    /* ---------- enlace activo en la navegación ---------- */
    safe('spy', function () {
      var secs = [].slice.call(document.querySelectorAll('main section[id]'));
      var links = [].slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
      if (!secs.length || !links.length || !('IntersectionObserver' in window)) return;

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
          });
        });
      }, { threshold: 0.05, rootMargin: '-45% 0px -50% 0px' });

      secs.forEach(function (s) { io.observe(s); });
    });

    /* ---------- botón flotante de WhatsApp ---------- */
    safe('wafab', function () {
      var fab = document.querySelector('.wafab');
      var foot = document.querySelector('.foot');
      if (!fab) return;
      var tick = false;
      function upd() {
        var show = window.scrollY > 520;
        if (foot) {
          var r = foot.getBoundingClientRect();
          if (r.top < window.innerHeight - 90) show = false;
        }
        fab.classList.toggle('is-in', show);
        tick = false;
      }
      upd();
      window.addEventListener('scroll', function () {
        if (!tick) { tick = true; window.requestAnimationFrame(upd); }
      }, { passive: true });
    });

    /* ---------- barra de progreso de lectura ---------- */
    safe('progress', function () {
      var bar = document.getElementById('progressBar');
      if (!bar) return;
      var tick = false;
      function upd() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, p)) + '%';
        tick = false;
      }
      upd();
      window.addEventListener('scroll', function () {
        if (!tick) { tick = true; window.requestAnimationFrame(upd); }
      }, { passive: true });
      window.addEventListener('resize', upd, { passive: true });
    });

    /* ---------- cifras que cuentan solas ---------- */
    safe('counters', function () {
      var nums = [].slice.call(document.querySelectorAll('.stat__n'));
      if (!nums.length) return;

      var slow = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function run(el) {
        var to = parseInt(el.getAttribute('data-to'), 10) || 0;
        var suf = el.getAttribute('data-suffix') || '';
        if (slow || to === 0) { el.textContent = to + suf; return; }
        var t0 = null, dur = 1300;
        function step(t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(to * e) + suf;
          if (k < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      }

      if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
        });
      }, { threshold: 0.05 });
      nums.forEach(function (el) { io.observe(el); });
      setTimeout(function () { nums.forEach(run); }, 4000);
    });

    /* ---------- luz que sigue al cursor en las tarjetas ---------- */
    safe('spotlight', function () {
      if (!window.matchMedia || !window.matchMedia('(hover:hover)').matches) return;
      var cards = [].slice.call(document.querySelectorAll('.card, .step, .case'));
      cards.forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });
    });

    /* ---------- leve parallax de las fichas del hero ---------- */
    safe('heroParallax', function () {
      if (!window.matchMedia || !window.matchMedia('(hover:hover)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var hero = document.querySelector('.hero');
      var art = document.querySelector('.hero__frame');
      if (!hero || !art) return;
      var raf = null, tx = 0, ty = 0;
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 10;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 8;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });
      hero.addEventListener('pointerleave', function () {
        tx = 0; ty = 0;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });
      function apply() {
        raf = null;
        art.style.transform = 'perspective(1200px) rotateY(' + (-4 + tx * 0.5) + 'deg) rotateX(' + (1.5 - ty * 0.4) + 'deg) translate3d(' + tx + 'px,' + ty + 'px,0)';
      }
    });

    /* ---------- luz grande que sigue al cursor (fondo) ---------- */
    safe('cursorGlow', function () {
      if (!window.matchMedia || !window.matchMedia('(hover:hover)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var g = document.querySelector('.bg__cursor');
      if (!g) return;
      var x = 0, y = 0, raf = null;
      window.addEventListener('pointermove', function (e) {
        x = e.clientX; y = e.clientY;
        g.classList.add('is-on');
        if (!raf) raf = window.requestAnimationFrame(function () {
          raf = null;
          g.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
        });
      }, { passive: true });
      document.addEventListener('pointerleave', function () { g.classList.remove('is-on'); });
    });

    /* ---------- panel de demostración: gráficos, pestañas y actividad ---------- */
    safe('dash', function () {
      var root = document.getElementById('dash');
      if (!root) return;

      var nf = new Intl.NumberFormat('es-CL');
      var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var NS = 'http://www.w3.org/2000/svg';
      var CIRC = 2 * Math.PI * 44;
      var COLORS = ['#17D3EA', '#C6F53F', '#B45BFF'];

      var DATA = {
        almacen: {
          name: 'Almacén Don Carlos',
          kpis: [
            { l: 'Ventas de hoy', v: 184500, pre: '$', d: '12% vs ayer', up: 1 },
            { l: 'Pedidos del día', v: 48, d: '8% vs ayer', up: 1 },
            { l: 'Consultas respondidas', v: 126, d: '92% por el asistente', up: 1 },
            { l: 'Clientes nuevos', v: 17, d: '5 más que ayer', up: 1 }
          ],
          A: { t: 'Ventas de la semana', s: 'en miles de $', v: [98, 112, 105, 131, 168, 196, 142], l: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
          B: { t: 'Pedidos por hora', s: 'hoy', v: [3, 5, 9, 7, 6, 8, 11, 9, 7, 10, 14, 12], l: ['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h'] },
          C: { t: 'Lo más pedido', s: 'unidades hoy', v: [['Pan integral', 64], ['Bebidas', 58], ['Lácteos', 47], ['Aseo', 33], ['Snacks', 29]] },
          D: { t: 'Origen de los pedidos', v: [['WhatsApp', 62], ['Web', 24], ['Teléfono', 14]] },
          feed: [
            { k: 'ok', t: 'Pedido confirmado · 2 pan integral', a: 2400 },
            { k: 'wa', t: 'Consulta respondida: "¿Hay leche sin lactosa?"', a: 0 },
            { k: 'ok', t: 'Pedido nuevo · $8.900 (retiro en tienda)', a: 8900 },
            { k: 'bot', t: 'Aviso de stock bajo: bebidas 1,5 L', a: 0 },
            { k: 'ok', t: 'Pedido confirmado · pack de lácteos', a: 6300 },
            { k: 'wa', t: 'Cliente frecuente volvió a pedir', a: 0 },
            { k: 'ok', t: 'Pedido nuevo · $12.400 (despacho)', a: 12400 },
            { k: 'bot', t: 'Recordatorio enviado: pedido listo', a: 0 }
          ]
        },
        salon: {
          name: 'Studio Nails',
          kpis: [
            { l: 'Ingresos de hoy', v: 236000, pre: '$', d: '15% vs ayer', up: 1 },
            { l: 'Citas del día', v: 19, d: '3 más que ayer', up: 1 },
            { l: 'Consultas respondidas', v: 84, d: '88% por el asistente', up: 1 },
            { l: 'Clientas nuevas', v: 7, d: '2 más que ayer', up: 1 }
          ],
          A: { t: 'Ingresos de la semana', s: 'en miles de $', v: [70, 92, 88, 110, 146, 214, 120], l: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
          B: { t: 'Reservas por hora', s: 'hoy', v: [1, 2, 3, 2, 2, 3, 4, 5, 6, 4, 2], l: ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h'] },
          C: { t: 'Servicios más reservados', s: 'esta semana', v: [['Manicure gel', 41], ['Esmaltado semipermanente', 36], ['Pedicure spa', 28], ['Diseño de uñas', 22], ['Retoque', 17]] },
          D: { t: 'Origen de las reservas', v: [['WhatsApp', 68], ['Instagram', 22], ['Web', 10]] },
          feed: [
            { k: 'ok', t: 'Reserva confirmada · Manicure gel 17:30', a: 18000 },
            { k: 'bot', t: 'Recordatorio enviado a Camila (mañana 11:00)', a: 0 },
            { k: 'wa', t: 'Consulta respondida: "¿Hacen diseños con piedras?"', a: 0 },
            { k: 'ok', t: 'Reserva confirmada · Pedicure spa 19:00', a: 22000 },
            { k: 'bot', t: 'Cita reagendada por WhatsApp', a: 0 },
            { k: 'ok', t: 'Reserva nueva · Esmaltado semipermanente', a: 15000 },
            { k: 'wa', t: 'Clienta pidió cotizar un diseño personalizado', a: 0 },
            { k: 'bot', t: 'Aviso: el cupo de las 18:00 está casi lleno', a: 0 }
          ]
        },
        taller: {
          name: 'Taller Mecánico Rojas',
          kpis: [
            { l: 'Ingresos de hoy', v: 412000, pre: '$', d: '9% vs ayer', up: 1 },
            { l: 'Cotizaciones enviadas', v: 14, d: '4 más que ayer', up: 1 },
            { l: 'Consultas respondidas', v: 58, d: '85% por el asistente', up: 1 },
            { l: 'Vehículos en taller', v: 9, d: '3 listos para retiro', up: 1 }
          ],
          A: { t: 'Ingresos de la semana', s: 'en miles de $', v: [280, 310, 295, 350, 420, 390, 150], l: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
          B: { t: 'Cotizaciones por hora', s: 'hoy', v: [1, 2, 4, 3, 2, 3, 5, 4, 3, 1], l: ['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'] },
          C: { t: 'Trabajos más frecuentes', s: 'este mes', v: [['Cambio de aceite', 31], ['Frenos', 24], ['Revisión técnica', 22], ['Alineación y balanceo', 18], ['Batería', 12]] },
          D: { t: 'Origen de las consultas', v: [['WhatsApp', 58], ['Llamada', 27], ['Web', 15]] },
          feed: [
            { k: 'ok', t: 'Cotización aceptada · Cambio de frenos', a: 85000 },
            { k: 'bot', t: 'Aviso enviado: tu vehículo está listo', a: 0 },
            { k: 'wa', t: 'Consulta respondida: "¿Cuánto sale la revisión?"', a: 0 },
            { k: 'ok', t: 'Orden de trabajo creada · Alineación', a: 35000 },
            { k: 'bot', t: 'Recordatorio: próxima mantención en 5.000 km', a: 0 },
            { k: 'ok', t: 'Cotización aceptada · Cambio de batería', a: 62000 },
            { k: 'wa', t: 'Cliente envió fotos del problema', a: 0 },
            { k: 'bot', t: 'Repuesto en camino · llega mañana', a: 0 }
          ]
        }
      };

      var order = ['almacen', 'salon', 'taller'];
      var cur = 'almacen';
      var vals = [];
      var feedIdx = 0, feedTimer = null, seen = false, armed = false;

      function $(id) { return document.getElementById(id); }
      function maxOf(a) { return Math.max.apply(null, a); }
      function fmt(k, v) { return (k.pre || '') + nf.format(v) + (k.suf || ''); }

      function smooth(p) {
        var d = 'M' + p[0][0].toFixed(1) + ',' + p[0][1].toFixed(1);
        for (var i = 0; i < p.length - 1; i++) {
          var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
          d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
               ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
               ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
        }
        return d;
      }

      function renderKpis(d) {
        vals = d.kpis.map(function (k) { return k.v; });
        $('kpis').innerHTML = d.kpis.map(function (k, i) {
          return '<article class="kpi"><span class="kpi__l">' + k.l + '</span>' +
            '<strong class="kpi__v" data-i="' + i + '">' + fmt(k, k.v) + '</strong>' +
            '<span class="kpi__d ' + (k.up ? 'up' : 'dn') + '">' + (k.up ? '▲ ' : '▼ ') + k.d + '</span></article>';
        }).join('');
      }

      function renderBars(d) {
        var W = 560, H = 230, pl = 8, pr = 8, pt = 26, pb = 30, n = d.v.length;
        var mx = maxOf(d.v) * 1.12, slot = (W - pl - pr) / n, bw = Math.min(46, slot * 0.58);
        var pk = d.v.indexOf(maxOf(d.v)), ph = H - pt - pb;
        var s = '<defs><linearGradient id="gb1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17D3EA"/><stop offset="1" stop-color="#17D3EA" stop-opacity=".22"/></linearGradient>' +
                '<linearGradient id="gb2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6F53F"/><stop offset="1" stop-color="#C6F53F" stop-opacity=".22"/></linearGradient></defs>';
        for (var g = 0; g <= 3; g++) {
          var gy = pt + ph * g / 3;
          s += '<line class="grid-l" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '"/>';
        }
        d.v.forEach(function (v, i) {
          var h = v / mx * ph, x = pl + slot * i + (slot - bw) / 2, y = H - pb - h;
          s += '<g class="b"><rect class="bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) +
               '" rx="9" fill="url(#' + (i === pk ? 'gb2' : 'gb1') + ')" style="transition-delay:' + (i * 70) + 'ms"/>' +
               '<text class="val" x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 8).toFixed(1) + '" text-anchor="middle">' + nf.format(v) + '</text>' +
               '<text class="ax" x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + d.l[i] + '</text></g>';
        });
        $('chartA').innerHTML = s;
      }

      function renderLine(d) {
        var W = 360, H = 230, pl = 10, pr = 14, pt = 34, pb = 30, n = d.v.length;
        var mx = maxOf(d.v) * 1.18, ph = H - pt - pb, pw = W - pl - pr;
        var pts = d.v.map(function (v, i) { return [pl + pw * i / (n - 1), H - pb - v / mx * ph]; });
        var line = smooth(pts);
        var area = line + ' L' + pts[n - 1][0].toFixed(1) + ',' + (H - pb) + ' L' + pts[0][0].toFixed(1) + ',' + (H - pb) + ' Z';
        var pk = d.v.indexOf(maxOf(d.v)), px = pts[pk][0], py = pts[pk][1];
        var lx = Math.min(W - 52, Math.max(52, px));
        var s = '<defs><linearGradient id="gl1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#17D3EA"/><stop offset="1" stop-color="#B45BFF"/></linearGradient>' +
                '<linearGradient id="gl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17D3EA" stop-opacity=".4"/><stop offset="1" stop-color="#17D3EA" stop-opacity="0"/></linearGradient></defs>';
        for (var g = 0; g <= 3; g++) {
          var gy = pt + ph * g / 3;
          s += '<line class="grid-l" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '"/>';
        }
        s += '<path class="ar" d="' + area + '" fill="url(#gl2)"/>';
        s += '<path class="ln" d="' + line + '" stroke="url(#gl1)" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/>';
        s += '<g class="pk-dot"><circle class="pk-halo" cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="6" fill="#C6F53F"/><circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" fill="#C6F53F" stroke="#070A18" stroke-width="2"/></g>';
        s += '<text class="val pk-lbl" x="' + lx.toFixed(1) + '" y="' + (py - 14).toFixed(1) + '" text-anchor="middle">Punta ' + d.l[pk] + ' · ' + d.v[pk] + '</text>';
        d.l.forEach(function (t, i) {
          if (n > 8 && i % 2 === 1 && i !== n - 1) return;
          s += '<text class="ax" x="' + pts[i][0].toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + t + '</text>';
        });
        $('chartB').innerHTML = s;
      }

      function renderHbars(d) {
        var mx = d.v[0][1];
        d.v.forEach(function (r) { if (r[1] > mx) mx = r[1]; });
        $('hbars').innerHTML = d.v.map(function (r, i) {
          return '<li><div class="hb__r"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>' +
                 '<div class="hb__t"><i style="--w:' + Math.round(r[1] / mx * 100) + '%;--dl:' + (i * 90) + 'ms"></i></div></li>';
        }).join('');
      }

      function renderDonut(d) {
        var tot = 0; d.v.forEach(function (r) { tot += r[1]; });
        var acc = 0, s = '<circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="14"/><g transform="rotate(-90 60 60)">';
        d.v.forEach(function (r, i) {
          var len = Math.max(0, r[1] / tot * CIRC - 3);
          s += '<circle class="seg" cx="60" cy="60" r="44" stroke="' + COLORS[i % 3] + '" stroke-dasharray="' + len.toFixed(2) + ' ' + (CIRC - len).toFixed(2) +
               '" stroke-dashoffset="' + (-acc).toFixed(2) + '" style="--dl:' + (i * 160) + 'ms"/>';
          acc += r[1] / tot * CIRC;
        });
        s += '</g><text class="dn-t" x="60" y="62" text-anchor="middle">' + Math.round(d.v[0][1] / tot * 100) + '%</text>' +
             '<text class="dn-s" x="60" y="76" text-anchor="middle">' + d.v[0][0] + '</text>';
        $('donut').innerHTML = s;
        $('legend').innerHTML = d.v.map(function (r, i) {
          return '<li><i style="background:' + COLORS[i % 3] + '"></i>' + r[0] + '<b>' + Math.round(r[1] / tot * 100) + '%</b></li>';
        }).join('');
      }

      var AGES = ['ahora', 'hace 1 min', 'hace 3 min', 'hace 5 min', 'hace 8 min'];
      var SYM = { ok: '✓', wa: '●', bot: '✦' };

      function feedHtml(list) {
        return list.map(function (f, i) {
          return '<li><span class="ic ' + f.k + '">' + SYM[f.k] + '</span><div><p>' + f.t + '</p><small>' + AGES[i] + '</small></div></li>';
        }).join('');
      }
      var shown = [];
      function renderFeed(d) {
        shown = d.feed.slice(0, 4).reverse();
        feedIdx = 4;
        $('feed').innerHTML = feedHtml(shown);
      }

      function tick() {
        var d = DATA[cur], f = d.feed[feedIdx % d.feed.length]; feedIdx++;
        shown.unshift(f); if (shown.length > 4) shown.length = 4;
        var ul = $('feed');
        ul.innerHTML = feedHtml(shown);
        if (ul.firstChild) ul.firstChild.className = 'new';
        if (f.a > 0) {
          vals[0] += f.a; vals[1] += 1;
          [0, 1].forEach(function (i) {
            var el = document.querySelector('.kpi__v[data-i="' + i + '"]');
            if (!el) return;
            el.textContent = fmt(d.kpis[i], vals[i]);
            el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
          });
        }
      }

      function startFeed() {
        stopFeed();
        if (reduce) return;
        feedTimer = window.setInterval(tick, 3800);
      }
      function stopFeed() { if (feedTimer) { window.clearInterval(feedTimer); feedTimer = null; } }

      function countUp() {
        var d = DATA[cur];
        [].slice.call(document.querySelectorAll('.kpi__v')).forEach(function (el) {
          var i = +el.getAttribute('data-i'), k = d.kpis[i];
          if (reduce) { el.textContent = fmt(k, k.v); return; }
          var t0 = null, to = k.v, dur = 1200;
          function step(t) {
            if (t0 === null) t0 = t;
            var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(k, Math.round(to * e));
            if (p < 1) window.requestAnimationFrame(step);
          }
          window.requestAnimationFrame(step);
        });
      }

      function renderAll() {
        var d = DATA[cur];
        $('dName').textContent = d.name;
        $('tA').textContent = d.A.t; $('sA').textContent = d.A.s;
        $('tB').textContent = d.B.t; $('sB').textContent = d.B.s;
        $('tC').textContent = d.C.t; $('sC').textContent = d.C.s;
        $('tD').textContent = d.D.t;
        renderKpis(d); renderBars(d.A); renderLine(d.B); renderHbars(d.C); renderDonut(d.D); renderFeed(d);
      }

      function arm() {
        armed = true;
        root.classList.remove('go');
        void root.offsetWidth;
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () { root.classList.add('go'); countUp(); });
        });
      }

      function setTab(k) {
        if (k === cur) return;
        cur = k;
        [].slice.call(root.querySelectorAll('.dash__tabs button')).forEach(function (b) {
          var on = b.getAttribute('data-k') === k;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          b.tabIndex = on ? 0 : -1;
        });
        $('dashBody').setAttribute('aria-labelledby', 'tab-' + k);
        renderAll();
        if (seen) { arm(); startFeed(); } else { root.classList.add('go'); }
      }

      root.querySelector('.dash__tabs').addEventListener('click', function (e) {
        var b = e.target.closest('button[data-k]');
        if (b) setTab(b.getAttribute('data-k'));
      });
      root.querySelector('.dash__tabs').addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var i = order.indexOf(cur) + (e.key === 'ArrowRight' ? 1 : -1);
        i = (i + order.length) % order.length;
        setTab(order[i]);
        var nb = root.querySelector('button[data-k="' + order[i] + '"]');
        if (nb) nb.focus();
        e.preventDefault();
      });

      renderAll();

      if (!('IntersectionObserver' in window)) { seen = true; root.classList.add('go'); return; }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (!armed) { seen = true; arm(); }
            startFeed();
          } else { stopFeed(); }
        });
      }, { threshold: 0.05 });
      io.observe(root);

      /* red de seguridad: si algo impide la animación, el panel igual se muestra completo */
      window.setTimeout(function () { if (!armed) { seen = true; arm(); } }, 4500);
    });

    /* ---------- formulario: envío sin recargar + aviso ---------- */
    safe('form', function () {
      var form = document.getElementById('contactForm');
      if (!form) return;

      /* si volvemos del envío clásico, mostramos el aviso de recibido */
      if (/[?&]enviado=1/.test(window.location.search)) {
        var okb = document.createElement('p');
        okb.className = 'form__ok';
        okb.setAttribute('role', 'status');
        okb.textContent = '¡Listo! Recibimos tu mensaje. Te respondemos muy pronto.';
        form.appendChild(okb);
      }

      form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) return;          // el navegador avisa
        if (!window.fetch || !window.FormData) return; // envío clásico de respaldo

        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var txt = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }

        var body = new URLSearchParams(new FormData(form)).toString();
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body
        }).then(function (r) {
          if (!r.ok) throw new Error('rechazado');
          done(true);
        }).catch(function () {
          done(false);
        });

        function done(ok) {
          if (btn) { btn.disabled = false; btn.innerHTML = txt; }
          var box = form.querySelector('.form__ok');
          if (!box) {
            box = document.createElement('p');
            box.className = 'form__ok';
            box.setAttribute('role', 'status');
            form.appendChild(box);
          }
          if (ok) {
            box.textContent = '¡Listo! Recibimos tu mensaje. Te respondemos muy pronto.';
            form.reset();
          } else {
            box.textContent = 'No pudimos enviarlo desde aquí. Escríbenos por WhatsApp al +56 9 9214 9576 y lo vemos al tiro.';
          }
        }
      });
    });

  });
})();
