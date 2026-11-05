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

        var ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        fetch(ajaxUrl, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        }).then(function (r) {
          return r.json().then(function (j) { return { ok: r.ok, j: j }; });
        }).then(function (res) {
          var good = res.ok && (res.j.success === true || res.j.success === 'true');
          if (!good) throw new Error('rechazado');
          done(true);
        }).catch(function () {
          /* respaldo: envío clásico (recarga la página, pero llega igual) */
          if (btn) { btn.disabled = false; btn.innerHTML = txt; }
          form.submit();
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
            box.textContent = 'No pudimos enviarlo desde aquí. Escríbenos por WhatsApp al +56 9 3172 1317 y lo vemos al tiro.';
          }
        }
      });
    });

  });
})();
