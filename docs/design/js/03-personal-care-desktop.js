/* Personal Care at Home in Beaufort, SC | Dawson & Dawson — page logic (scroll animations, interactions, states) */
class Component extends DCLogic {
  g(k, d) { var s = this.state; return (s && s[k] !== undefined) ? s[k] : d; }
  liveDefault() {
    try {
      var vh = window.innerHeight;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return vh > 200 && vh < 2000 && !reduce;
    } catch (e) { return false; }
  }
  componentDidMount() {
    var self = this, root = this.rootEl;
    this.initCursor();
    if (!root) return;
    var doc = root.ownerDocument, win = doc.defaultView || window;
    this._win = win; this._raf = 0; this._fillH = 0;
    try { var saved = win.sessionStorage.getItem('dd_pc_needs'); if (saved) this.setState({ ticks: JSON.parse(saved) }); } catch (e) {}
    this._onScroll = function () { if (!self._raf) self._raf = win.requestAnimationFrame(function () { self._raf = 0; self.update(); }); };
    win.addEventListener('scroll', this._onScroll, { passive: true });
    win.addEventListener('resize', this._onScroll, { passive: true });
    this.bind();
  }
  componentDidUpdate() { this.bind(); }
  componentWillUnmount() {
    if (this.stopCursor) this.stopCursor();
    var win = this._win;
    if (win) { win.removeEventListener('scroll', this._onScroll); win.removeEventListener('resize', this._onScroll); if (this._raf) win.cancelAnimationFrame(this._raf); }
  }
  bind() {
    var root = this.rootEl; if (!root) return;
    var hv = root.querySelectorAll('video[data-hv]');
    for (var i = 0; i < hv.length; i++) {
      var x = hv[i];
      if (x._ddBound) continue;
      x._ddBound = true; x.muted = true; x.loop = true; x.playsInline = true;
      x.addEventListener('playing', function () { if (this.parentNode) this.parentNode.setAttribute('data-playing', 'true'); });
      x.addEventListener('pause', function () { if (this.parentNode) this.parentNode.setAttribute('data-playing', 'false'); });
      try { var p = x.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
    }
    this.update();
  }
  update() {
    var root = this.rootEl, win = this._win; if (!root || !win) return;
    var live = this.liveDefault();
    var list = root.querySelector('[data-el="day"]'), fill = root.querySelector('[data-el="day-fill"]');
    if (!list || !fill) return;
    var steps = list.querySelectorAll('[data-day-step]');
    var lr = list.getBoundingClientRect();
    var last = steps[steps.length - 1];
    var span = last ? (last.getBoundingClientRect().top - lr.top) : lr.height;
    var idx, h;
    if (live) {
      var line = win.innerHeight * 0.55;
      idx = -1;
      for (var i = 0; i < steps.length; i++) { var r = steps[i].getBoundingClientRect(); if (r.top + 36 <= line) idx = i; }
      h = Math.max(0, Math.min(span, line - lr.top - 44));
    } else { idx = 0; h = span; }
    this._fillH = h;
    fill.style.height = h + 'px';
    if (idx !== this.g('dayStep', live ? -1 : 0)) this.setState({ dayStep: idx });
  }
  initCursor() {
    var el = this.ringEl;
    if (!el) return;
    var doc = el.ownerDocument; var win = doc.defaultView || window;
    var mm = function (q) { try { return win.matchMedia(q).matches; } catch (e) { return false; } };
    var html = doc.documentElement;
    if (!mm('(pointer: fine) and (hover: hover)') || mm('(prefers-reduced-motion: reduce)') || mm('(forced-colors: active)') || html.getAttribute('data-motion') === 'reduce' || html.getAttribute('data-contrast') === 'high') { el.style.display = 'none'; return; }
    var INTERACTIVE = ['a[href]','button','summary','select','label[for]','[role="button"]','[role="link"]','[role="tab"]','[role="option"]','[role="menuitem"]','[role="switch"]','[role="checkbox"]','[role="radio"]','input[type="submit"]','input[type="button"]','input[type="reset"]','input[type="checkbox"]','input[type="radio"]','input[type="range"]','[data-cursor]:not([data-cursor="none"])'].join(',');
    var TEXT = ['input:not([type])','input[type="text"]','input[type="email"]','input[type="tel"]','input[type="search"]','input[type="number"]','input[type="url"]','input[type="password"]','textarea','[contenteditable=""]','[contenteditable="true"]'].join(',');
    var DISABLED = ':disabled, [aria-disabled="true"]';
    var label = el.querySelector('.cursor-ring__label');
    var x = 0, y = 0, rx = 0, ry = 0, seen = false, raf = 0, last = 0, lastT = null;
    var apply = function (t) {
      var state = 'idle', theme = 'light', text = '';
      if (t && t.closest) {
        var th = t.closest('[data-cursor-theme]');
        if (th && th.getAttribute('data-cursor-theme') === 'dark') theme = 'dark';
        var inter = t.closest(INTERACTIVE);
        if (t.closest('[data-cursor="none"]')) state = 'none';
        else if (inter && inter.matches(DISABLED)) state = 'idle';
        else if (t.closest(TEXT)) state = 'text';
        else {
          var lab = t.closest('[data-cursor-label]');
          if (lab) { state = 'label'; text = lab.getAttribute('data-cursor-label') || ''; }
          else if (inter) state = 'interactive';
        }
      }
      el.setAttribute('data-state', state);
      el.setAttribute('data-theme', theme);
      if (label && label.textContent !== text) label.textContent = text;
    };
    var tick = function (now) {
      var dt = last ? Math.min(64, now - last) : 16.667; last = now;
      var k = 1 - Math.pow(1 - 0.15, dt / 16.667);
      rx += (x - rx) * k; ry += (y - ry) * k;
      el.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) { raf = 0; last = 0; return; }
      raf = win.requestAnimationFrame(tick);
    };
    var start = function () { if (!raf) { last = 0; raf = win.requestAnimationFrame(tick); } };
    var onMove = function (e) {
      if (e.pointerType === 'touch') return;
      x = e.clientX; y = e.clientY;
      if (!seen) { rx = x; ry = y; seen = true; }
      el.setAttribute('data-visible', 'true'); start();
    };
    var onOver = function (e) { if (e.target !== lastT) { lastT = e.target; apply(e.target); } };
    var onDown = function (e) { if (e.pointerType === 'touch') { el.setAttribute('data-visible', 'false'); return; } if (e.button === 0) el.setAttribute('data-pressed', 'true'); };
    var onUp = function () { el.setAttribute('data-pressed', 'false'); };
    var onOut = function (e) { if (!e.relatedTarget) el.setAttribute('data-visible', 'false'); };
    var onScroll = function () { if (!seen) return; var t = doc.elementFromPoint(x, y); lastT = t; apply(t); };
    var onFocus = function (e) { try { if (e.target && e.target.matches && e.target.matches(':focus-visible')) el.setAttribute('data-visible', 'false'); } catch (err) {} };
    var onVis = function () { if (doc.hidden && raf) { win.cancelAnimationFrame(raf); raf = 0; } };
    var opt = { passive: true };
    doc.addEventListener('pointermove', onMove, opt);
    doc.addEventListener('pointerover', onOver, opt);
    doc.addEventListener('pointerdown', onDown, opt);
    doc.addEventListener('pointerup', onUp, opt);
    doc.addEventListener('pointercancel', onUp, opt);
    doc.addEventListener('pointerout', onOut, opt);
    doc.addEventListener('focusin', onFocus, opt);
    doc.addEventListener('visibilitychange', onVis, opt);
    win.addEventListener('scroll', onScroll, { passive: true, capture: true });
    this.stopCursor = function () {
      doc.removeEventListener('pointermove', onMove, opt);
      doc.removeEventListener('pointerover', onOver, opt);
      doc.removeEventListener('pointerdown', onDown, opt);
      doc.removeEventListener('pointerup', onUp, opt);
      doc.removeEventListener('pointercancel', onUp, opt);
      doc.removeEventListener('pointerout', onOut, opt);
      doc.removeEventListener('focusin', onFocus, opt);
      doc.removeEventListener('visibilitychange', onVis, opt);
      win.removeEventListener('scroll', onScroll, { capture: true });
      if (raf) win.cancelAnimationFrame(raf);
    };
  }

  renderVals() {
    var self = this;
    var P = this.props || {};
    var open = (P.office || 'open') !== 'closed';
    var pending = P.showPending !== false;
    var live = this.liveDefault();
    var ticks = this.g('ticks', {});
    var faq = this.g('faq', 0);
    var day = this.g('dayStep', live ? -1 : 0);
    var year = new Date().getFullYear();
    var assess = '/free-assessment?service=personal-care' + (open ? '' : '&after_hours=true');

    var CHECKS = [
      ['pc-bathing', 'Showering or bathing has started to feel risky.'],
      ['pc-dressing', 'Getting dressed takes ages, or buttons and zippers are hard.'],
      ['pc-transfers', 'Getting out of bed or up from a chair is a struggle.'],
      ['pc-toileting', 'A little help in the bathroom would make life easier.'],
      ['pc-hospital', "They're coming home from the hospital and need a hand for a while."]
    ];
    var on = CHECKS.filter(function (c) { return !!ticks[c[0]]; }).map(function (c) { return c[0]; });
    var checks = CHECKS.map(function (c) {
      var t = !!ticks[c[0]];
      return {
        id: c[0], label: c[1], checked: t, on: t ? 'true' : 'false',
        toggle: function () {
          var next = {}; for (var k in ticks) next[k] = ticks[k];
          if (next[c[0]]) delete next[c[0]]; else next[c[0]] = true;
          try { (self._win || window).sessionStorage.setItem('dd_pc_needs', JSON.stringify(next)); } catch (e) {}
          self.setState({ ticks: next });
        }
      };
    });

    var STEPS = [
      ['8:00 AM', '08:00', 8, 'Good morning', 'The caregiver arrives, puts the coffee on and asks Mom how she slept.'],
      ['8:30 AM', '08:30', 8.5, 'A warm shower', 'Towels ready, water just right. She does what she can. We help with the rest.'],
      ['9:15 AM', '09:15', 9.25, 'Dressed for the day', 'She picks the outfit. We help with buttons, shoes and hair.'],
      ['9:45 AM', '09:45', 9.75, 'Breakfast together', 'A good breakfast, eaten at her pace, with someone to talk to.'],
      ['10:30 AM', '10:30', 10.5, 'Settled in', 'A steady arm to her favorite chair, everything she needs within reach.'],
      ['7:00 PM', '19:00', 19, 'Evening visit', 'Washing up, into pajamas and safely into bed. Lights low, phone by the bed.']
    ];
    var steps = STEPS.map(function (s, i) {
      return { i: i, time: s[0], dt: s[1], title: s[3], line: s[4], on: (!live || i <= day) ? 'true' : 'false', cur: i === day ? 'true' : 'false', isSun: i < 5, isMoon: i === 5 };
    });
    var cur = STEPS[Math.max(0, day)];
    var f = (cur[2] - 7) / 13, ang = Math.PI * (1 - f);
    var night = day === 5;

    var FAQ = [
      ['pc-privacy', 'Mom is very private. Will this embarrass her?', "We understand — it's the most common worry we hear. Your caregiver asks before helping, keeps her covered and lets her do whatever she can on her own. Many clients find it easier to accept help from a kind professional than from their own children.", '', ''],
      ['pc-mobility', 'Can you help if Dad uses a walker or wheelchair?', 'Yes. We help with moving from bed to chair, chair to wheelchair and room to room. At the free visit, our owner looks at how the home is set up so we can plan safe moves.', '[Experience with mechanical lifts (e.g. Hoyer) — add one sentence if yes]', ''],
      ['pc-not-nursing', 'Is personal care the same as nursing?', "No. Personal care is non-medical help with everyday things like bathing, dressing and using the bathroom. We don't give injections, change wound dressings or provide nursing. If your loved one needs medical care, we work alongside your home health team.", '', ''],
      ['pc-hospital', 'Can you start when Mom comes home from the hospital?', 'Yes — the first days home are when many families call us. If you can, call before discharge so we can plan the visit. How soon care can start:', '[Typical start time]', '.'],
      ['pc-visit-length', 'How long is a personal care visit?', 'As long as you need. Some families want a morning visit for bathing and dressing. Others add an evening visit or longer days. Visits start at', '[Minimum hours]', ' hours.']
    ];
    var faqs = FAQ.map(function (q, n) {
      var o = faq === n;
      return { id: q[0], aid: q[0] + '-a', q: q[1], a: q[2], hasTbc: !!q[3], tbc: q[3], after: q[4], open: o, exp: o ? 'true' : 'false', rot: o ? 'rotate(180deg)' : 'rotate(0deg)', toggle: function () { self.setState({ faq: o ? -1 : n }); } };
    });

    return {
      rootRef: function (node) { self.rootEl = node; },
      ringRef: function (node) { self.ringEl = node; },
      yes: true,
      isOpen: open, isClosed: !open, pending: pending,
      currentYear: year,
      assessHref: assess,
      checks: checks,
      hasTicks: on.length > 0,
      resultText: on.length >= 3 ? "Personal Care sounds like a good fit. Let's talk it through at your free visit." : "That's worth a conversation. We'll talk it through at your free visit.",
      needsHref: assess + '&needs=' + on.join(','),
      steps: steps,
      dayFillH: this._fillH || 0,
      skyTime: cur[0], skyTitle: cur[3],
      skyX: Math.round(280 + 240 * Math.cos(ang)), skyY: Math.round(360 - 240 * Math.sin(ang)),
      sunOp: night ? 0 : 1, moonOp: night ? 1 : 0,
      skyBg: night ? '#2A1856' : '#EEF6DC',
      skyInk: night ? '#FFFFFF' : '#2A1856',
      skyArc: night ? '#8E3BA8' : '#4A7309',
      faqs: faqs
    };
  }
}

DCMount(Component, {"office": {"editor": "enum", "options": ["open", "closed"], "default": "open", "section": "States"}, "showPending": {"editor": "boolean", "default": true, "section": "States"}});
