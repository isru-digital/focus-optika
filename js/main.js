/* אופטיקה פוקוס - engine
   lens effect, focus grid, frame finder, booking form, counters */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- config (change per client) ---------- */
  var WA_NUMBER = '972501234567'; // demo number - replace with the store's WhatsApp
  var PLACEHOLDER = 'assets/img/placeholder.svg';

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  /* ---------- product catalog ---------- */
  var EYEGLASSES = [
    { id: 'aria',   name: 'ARIA',   img: 'assets/img/frame-round-gold',    tags: 'מתכת · עגולות · זהב',        price: 690,  badge: 'הנמכר ביותר', badgeStyle: 'honey', shapes: ['square', 'heart'], styles: ['classic', 'light', 'retro'] },
    { id: 'nero',   name: 'NERO',   img: 'assets/img/frame-square-black',  tags: 'אצטט · מרובעות · שחור',      price: 750,  badge: '',            badgeStyle: '',      shapes: ['round', 'oval'],   styles: ['classic', 'bold'] },
    { id: 'luna',   name: 'LUNA',   img: 'assets/img/frame-cateye-tortoise', tags: 'אצטט · חתולי · טורטויז',   price: 820,  badge: 'חדש',         badgeStyle: '',      shapes: ['heart', 'oval'],   styles: ['retro', 'bold'] },
    { id: 'featherlight', name: 'FEATHER', img: 'assets/img/frame-rimless-titanium', tags: 'טיטניום · ללא מסגרת · 9 גרם', price: 1190, badge: '', badgeStyle: '', shapes: ['round', 'square', 'oval', 'heart'], styles: ['light', 'classic'] },
    { id: 'crystal', name: 'CRYSTAL', img: 'assets/img/frame-clear-acetate', tags: 'אצטט שקוף · מרובעות רכות', price: 640,  badge: '',            badgeStyle: '',      shapes: ['round', 'oval'],   styles: ['light', 'retro'] },
    { id: 'pixel',  name: 'PIXEL',  img: 'assets/img/frame-office-blue',   tags: 'סינון אור כחול · למסכים',    price: 580,  badge: 'לעובדי הייטק', badgeStyle: 'honey', shapes: ['round', 'square', 'oval', 'heart'], styles: ['classic', 'bold'] }
  ];

  var SUNGLASSES = [
    { id: 'pilot',  name: 'PILOT',  img: 'assets/img/sun-aviator-gold', tags: 'טייסים · עדשות ירוקות · UV400', price: 560, badge: 'קלאסיקה', badgeStyle: 'honey' },
    { id: 'shade',  name: 'SHADE',  img: 'assets/img/sun-wayfarer-black', tags: 'וויפרר · פולארויד · UV400',   price: 520, badge: '',        badgeStyle: '' },
    { id: 'divaa',  name: 'DIVA',   img: 'assets/img/sun-oversized-brown', tags: 'אוברסייז · גרדיאנט · UV400', price: 610, badge: 'חדש',     badgeStyle: '' }
  ];

  function cardHTML(p, opts) {
    var badge = p.badge
      ? '<span class="badge ' + (p.badgeStyle === 'honey' ? 'badge-honey' : '') + '">' + p.badge + '</span>'
      : '';
    var wa = waLink('היי! ראיתי באתר את מסגרת ' + p.name + ' ואשמח למדוד אותה 🙂');
    var priceNote = (opts && opts.sun) ? 'כולל הגנת UV מלאה' : 'כולל עדשות בסיסיות';
    return (
      '<article class="product-card" data-id="' + p.id + '" tabindex="0">' +
        '<div class="product-img">' + badge +
          '<picture>' +
            '<source srcset="' + p.img + '.webp" type="image/webp">' +
            '<img src="' + p.img + '.jpg" alt="משקפי ' + p.name + ' - ' + p.tags + '" loading="lazy" ' +
                 'onerror="this.onerror=null;this.src=\'' + PLACEHOLDER + '\'">' +
          '</picture>' +
          // real pre-blurred copy on top; sharpening = opacity fade only (never blanks on mobile)
          '<img class="product-blur" src="' + p.img + '-blur.jpg" alt="" aria-hidden="true" loading="lazy" ' +
               'onerror="this.remove()">' +
          '<span class="product-gloss" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="product-body">' +
          '<h3>' + p.name + '</h3>' +
          '<p class="product-tags">' + p.tags + '</p>' +
          '<div class="product-foot">' +
            '<span class="product-price">₪' + p.price + '<small>' + priceNote + '</small></span>' +
            '<a class="product-wa" href="' + wa + '" target="_blank" rel="noopener">רוצה למדוד</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  var eyeGrid = document.getElementById('eyeGrid');
  var sunGrid = document.getElementById('sunGrid');
  if (eyeGrid) eyeGrid.innerHTML = EYEGLASSES.map(function (p) { return cardHTML(p); }).join('');
  if (sunGrid) sunGrid.innerHTML = SUNGLASSES.map(function (p) { return cardHTML(p, { sun: true }); }).join('');

  /* ---------- touch focus effect (tap a card -> it sharpens, rest blur) ---------- */
  var supportsHover = window.matchMedia('(hover: hover)').matches;
  if (!supportsHover) {
    document.querySelectorAll('.focus-grid').forEach(function (grid) {
      grid.addEventListener('click', function (e) {
        var card = e.target.closest('.product-card');
        if (!card) return;
        if (e.target.closest('a')) return; // let the WhatsApp link work
        var wasFocused = card.classList.contains('is-focus');
        grid.querySelectorAll('.product-card.is-focus').forEach(function (c) { c.classList.remove('is-focus'); });
        grid.classList.remove('has-focus');
        if (!wasFocused) {
          card.classList.add('is-focus');
          grid.classList.add('has-focus');
        }
      });
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 3D tilt + gloss on product cards (pointer devices) ---------- */
  if (supportsHover && !reduceMotion) {
    document.querySelectorAll('.focus-grid').forEach(function (grid) {
      grid.addEventListener('pointermove', function (e) {
        var card = e.target.closest('.product-card');
        if (!card) return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;   // 0..1
        var py = (e.clientY - r.top) / r.height;   // 0..1
        var rx = (0.5 - py) * 8;                    // rotateX
        var ry = (px - 0.5) * 10;                   // rotateY
        card.style.transform = 'translateY(-8px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(1.03)';
        var gloss = card.querySelector('.product-gloss');
        if (gloss) { gloss.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); gloss.style.setProperty('--gy', (py * 100).toFixed(1) + '%'); }
      });
      grid.addEventListener('pointerleave', function () {
        grid.querySelectorAll('.product-card').forEach(function (c) { c.style.transform = ''; });
      });
      grid.addEventListener('pointerout', function (e) {
        var card = e.target.closest('.product-card');
        if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
      });
    });
  }

  /* ---------- vision mode: tap -> glasses fly in 3D and get "worn" -> world sharpens ---------- */
  var vision = document.getElementById('vision');
  var vStage = document.getElementById('visionStage');
  var vBg = document.getElementById('visionBg');
  var vCta = document.getElementById('visionCta');
  if (vision && vStage && vBg && vCta && !reduceMotion) {
    var gyroWired = false;
    var wireGyro = function () {
      if (gyroWired || typeof DeviceOrientationEvent === 'undefined') return;
      var attach = function () {
        gyroWired = true;
        window.addEventListener('deviceorientation', function (e) {
          if (e.gamma == null) return;
          nudge(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - 45) / 25)));
        });
      };
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS: must be called inside a user gesture - the CTA tap is one
        DeviceOrientationEvent.requestPermission()
          .then(function (state) { if (state === 'granted') attach(); })
          .catch(function () {});
      } else {
        attach();
      }
    };

    var playVision = function () {
      if (vision.classList.contains('play')) return;
      vision.classList.add('play');
      wireGyro();
      startParallax();
    };
    vCta.addEventListener('click', playVision);

    // reset when the section scrolls away so the show replays next visit
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { startParallax(); }
          else { stopParallax(); vision.classList.remove('play'); }
        });
      }, { threshold: 0.15 }).observe(vStage);
    }

    // parallax on the world - device tilt (after CTA tap on iOS), mouse, + idle drift
    var pTargetX = 0, pTargetY = 0, pCurX = 0, pCurY = 0, pActive = false, pRAF = null, pAuto = 0, pLastInput = -99999, pClock = 0;
    var renderParallax = function () {
      pClock += 1;
      if (pClock - pLastInput > 80) {           // idle -> slow automatic drift
        pAuto += 0.01;
        pTargetX = Math.sin(pAuto) * 0.7;
        pTargetY = Math.cos(pAuto * 0.7) * 0.5;
      }
      pCurX += (pTargetX - pCurX) * 0.07;
      pCurY += (pTargetY - pCurY) * 0.07;
      // stronger travel once the glasses are on (the "look around" moment)
      var amp = vision.classList.contains('play') ? 30 : 12;
      vBg.style.setProperty('--px', (pCurX * amp).toFixed(1) + 'px');
      vBg.style.setProperty('--py', (pCurY * amp * 0.72).toFixed(1) + 'px');
      if (pActive) pRAF = requestAnimationFrame(renderParallax); else pRAF = null;
    };
    function startParallax() { if (!pActive) { pActive = true; if (!pRAF) pRAF = requestAnimationFrame(renderParallax); } }
    function stopParallax() { pActive = false; }
    function nudge(nx, ny) {
      pTargetX = Math.max(-1, Math.min(1, nx));
      pTargetY = Math.max(-1, Math.min(1, ny));
      pLastInput = pClock; startParallax();
    }
    vStage.addEventListener('pointermove', function (e) {
      var r = vStage.getBoundingClientRect();
      nudge(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
    }, { passive: true });
    // Android exposes gyro without permission - wire it up front
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      wireGyro();
    }
  }

  /* ---------- cinema: scroll-driven scenes + counter + blur-to-sharp intro ---------- */
  var cinema = document.getElementById('cinema');
  var cinemaBottom = 0;
  if (cinema) {
    var track = document.getElementById('cinemaTrack');
    var scenes = [].slice.call(cinema.querySelectorAll('.cine-scene'));
    var caps = [].slice.call(cinema.querySelectorAll('.cine-cap'));
    var bar = document.getElementById('cineBar');
    var numEl = document.getElementById('cineNum');
    var cue = cinema.querySelector('.cine-cue');
    var N = scenes.length;
    var scene0Img = scenes[0].querySelector('.cine-img');
    var cineRAF = false, curCap = 0;

    var renderCinema = function () {
      cineRAF = false;
      var rect = track.getBoundingClientRect();
      var total = track.offsetHeight - window.innerHeight; // scrollable distance while pinned
      var scrolled = Math.min(Math.max(-rect.top, 0), total);
      var p = total > 0 ? scrolled / total : 0;            // 0..1 across the whole journey
      var sf = p * (N - 1);                                // scene float 0..N-1

      // crossfade scenes
      for (var i = 0; i < N; i++) {
        var op = 1 - Math.min(Math.abs(sf - i), 1);
        scenes[i].style.opacity = op.toFixed(3);
      }
      // blur-to-sharp on the very first scene as you enter
      if (scene0Img) {
        var b = Math.max(0, (0.12 - p) / 0.12) * 16;
        scene0Img.style.filter = b > 0.2 ? 'blur(' + b.toFixed(1) + 'px)' : 'none';
      }
      // active caption + counter
      var active = Math.round(sf);
      if (active !== curCap) {
        caps[curCap].classList.remove('on');
        caps[active].classList.add('on');
        numEl.textContent = ('0' + (active + 1)).slice(-2);
        curCap = active;
      }
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
      if (cue) cue.style.opacity = p > 0.04 ? '0' : '1';
    };
    var onCinemaScroll = function () {
      if (!cineRAF) { cineRAF = true; requestAnimationFrame(renderCinema); }
    };
    window.addEventListener('scroll', onCinemaScroll, { passive: true });
    window.addEventListener('resize', function () { cinemaBottom = cinema.offsetTop + cinema.offsetHeight; onCinemaScroll(); }, { passive: true });
    cinemaBottom = cinema.offsetTop + cinema.offsetHeight;
    renderCinema();
  }

  /* ---------- header state (transparent over the cinema, solid after) ---------- */
  var header = document.getElementById('siteHeader');
  var onScrollHeader = function () {
    var past = cinema ? (window.scrollY > cinemaBottom - 140) : (window.scrollY > 40);
    header.classList.toggle('solid', past);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && window.innerHeight > 0) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4 * 60, 180) + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- animated counters ---------- */
  var counted = false;
  function runCounters() {
    if (counted) return;
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;
    var top = nums[0].getBoundingClientRect().top;
    if (top > window.innerHeight - 60) return;
    counted = true;
    nums.forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var start = null;
      var dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('he-IL');
        if (p < 1) requestAnimationFrame(step);
      }
      if (reduceMotion) { el.textContent = target.toLocaleString('he-IL'); }
      else { requestAnimationFrame(step); }
    });
  }
  window.addEventListener('scroll', runCounters, { passive: true });
  runCounters();

  /* ---------- frame finder ---------- */
  var finderBox = document.getElementById('finderBox');
  if (finderBox) {
    var answers = {};
    var bar = document.getElementById('finderBar');
    var steps = finderBox.querySelectorAll('.finder-step');

    function showStep(n) {
      steps.forEach(function (s) { s.hidden = s.dataset.step !== String(n); });
      if (bar) bar.style.width = (n / 4) * 100 + '%';
      if (n > 1) finderBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    function pickFrames() {
      var scored = EYEGLASSES.map(function (p) {
        var score = 0;
        if (p.shapes.indexOf(answers.face) !== -1) score += 2;
        if (p.styles.indexOf(answers.style) !== -1) score += 2;
        if (answers.use === 'screen' && p.id === 'pixel') score += 3;
        if (answers.use === 'reading' && (p.id === 'featherlight' || p.id === 'aria')) score += 1;
        if (answers.use === 'fashion' && (p.id === 'luna' || p.id === 'nero')) score += 1;
        return { p: p, score: score };
      }).sort(function (a, b) { return b.score - a.score; });
      return [scored[0].p, scored[1].p];
    }

    var faceNames = { round: 'עגולות', square: 'מרובעות', oval: 'אובליות', heart: 'לב' };

    finderBox.addEventListener('click', function (e) {
      var opt = e.target.closest('.finder-opt');
      if (!opt) return;
      answers[opt.dataset.q] = opt.dataset.v;
      var current = parseInt(opt.closest('.finder-step').dataset.step, 10);
      if (current < 3) { showStep(current + 1); return; }

      // result
      var picks = pickFrames();
      var picksEl = document.getElementById('finderPicks');
      var noteEl = document.getElementById('finderNote');
      var waEl = document.getElementById('finderWa');
      picksEl.innerHTML = picks.map(function (p) { return cardHTML(p); }).join('');
      noteEl.textContent = 'לפנים ' + (faceNames[answers.face] || '') +
        ' בחרנו מסגרות שמאזנות את קווי הפנים ומחמיאות במיוחד. רוצים לראות אותן עליכם?';
      waEl.href = waLink('היי! עשיתי התאמת מסגרת באתר ויצא לי: ' + picks[0].name + ' או ' + picks[1].name + '. אשמח לתאם מדידה 🙂');
      showStep(4);
    });

    var restart = document.getElementById('finderRestart');
    if (restart) restart.addEventListener('click', function () {
      answers = {};
      showStep(1);
    });
  }

  /* ---------- booking form -> WhatsApp ---------- */
  var form = document.getElementById('examForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameF = document.getElementById('fName');
      var phoneF = document.getElementById('fPhone');
      var ok = true;

      [nameF, phoneF].forEach(function (input) {
        var field = input.closest('.field');
        var valid = input === phoneF
          ? /^0\d{1,2}-?\d{7}$|^\+?\d{9,13}$/.test(input.value.replace(/[\s-]/g, ''))
          : input.value.trim().length >= 2;
        field.classList.toggle('err', !valid);
        field.querySelector('.field-err').hidden = valid;
        if (!valid && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;

      var btn = document.getElementById('examSubmit');
      btn.querySelector('.btn-label').hidden = true;
      btn.querySelector('.btn-loading').hidden = false;
      btn.disabled = true;

      var msg = 'קביעת תור לבדיקת ראייה 👓\n' +
        'שם: ' + nameF.value.trim() + '\n' +
        'טלפון: ' + phoneF.value.trim() + '\n' +
        'מועד מועדף: ' + document.getElementById('fWhen').value;
      var note = document.getElementById('fNote').value.trim();
      if (note) msg += '\nהערות: ' + note;

      setTimeout(function () {
        window.open(waLink(msg), '_blank', 'noopener');
        btn.querySelector('.btn-label').hidden = false;
        btn.querySelector('.btn-loading').hidden = true;
        btn.disabled = false;
        document.getElementById('formSuccess').hidden = false;
        form.reset();
      }, 600);
    });
  }

  /* ---------- generic WhatsApp links ---------- */
  var waFloat = document.getElementById('waFloat');
  if (waFloat) waFloat.href = waLink('היי! הגעתי מהאתר של אופטיקה פוקוס ואשמח לפרטים 🙂');
  var waAlt = document.getElementById('waAlt');
  if (waAlt) waAlt.href = waLink('היי! אשמח לקבוע תור לבדיקת ראייה 🙂');

})();
