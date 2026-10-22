/* Dawson & Dawson Home Care — Homepage (mobile) — page logic (scroll animations, interactions, states) */
class Component extends DCLogic {
  g(k, d) { var s = this.state; return (s && s[k] !== undefined) ? s[k] : d; }
  componentDidMount() {
    var self = this, root = this.rootEl, sc = this.scEl;
    if (!root || !sc) return;
    var doc = root.ownerDocument, win = doc.defaultView || window;
    this._win = win; this._doc = doc; this._raf = 0; this._ended = false; this._fast = false; this._endedAt = 0;
    try { this._reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { this._reduce = false; }
    this._onScroll = function () { if (!self._raf) self._raf = win.requestAnimationFrame(function () { self._raf = 0; self.update(); }); };
    this._onWheel = function () { self.fastForward(); };
    this._onEnter = function () { self.maybeReplay(); };
    this._onFocusIn = function (e) { var t = e.target; if (t && t.matches && t.matches('input:not([type="range"]),select,textarea')) root.setAttribute('data-typing', 'true'); };
    this._onFocusOut = function () { root.setAttribute('data-typing', 'false'); };
    sc.addEventListener('scroll', this._onScroll, { passive: true });
    sc.addEventListener('wheel', this._onWheel, { passive: true });
    sc.addEventListener('touchmove', this._onWheel, { passive: true });
    root.addEventListener('pointerenter', this._onEnter);
    root.addEventListener('focusin', this._onFocusIn);
    root.addEventListener('focusout', this._onFocusOut);
    this._onResize = function () { self.update(); };
    win.addEventListener('resize', this._onResize, { passive: true });
    this.bind();
    var start = (this.props && this.props.startAt) || 'intro';
    this._lastStart = start;
    if (start !== 'intro' || this._reduce) this.jumpTo(start === 'intro' ? 'hero' : start);
  }
  componentDidUpdate() {
    this.bind();
    var b = (this.props && this.props.startAt) || 'intro';
    if (b !== this._lastStart) { this._lastStart = b; if (b === 'intro') this.replay(); else this.jumpTo(b); }
  }
  componentWillUnmount() {
    var win = this._win, sc = this.scEl, root = this.rootEl;
    if (sc) { sc.removeEventListener('scroll', this._onScroll); sc.removeEventListener('wheel', this._onWheel); sc.removeEventListener('touchmove', this._onWheel); }
    if (root) { root.removeEventListener('pointerenter', this._onEnter); root.removeEventListener('focusin', this._onFocusIn); root.removeEventListener('focusout', this._onFocusOut); }
    if (win) { win.removeEventListener('resize', this._onResize); if (this._raf) win.cancelAnimationFrame(this._raf); win.clearTimeout(this._endTimer); }
  }
  vid() { return this.rootEl ? this.rootEl.querySelector('[data-el="intro-video"]') : null; }
  lock(on) { if (this.scEl) this.scEl.style.overflowY = on ? 'hidden' : 'auto'; }
  fastForward() {
    if (this._ended) return;
    var v = this.vid(); if (!v) return;
    if (!this._fast) {
      this._fast = true;
      try { v.playbackRate = 8; } catch (e) {}
      if (v.paused) { try { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
    }
  }
  finishIntro() {
    if (this._ended) return;
    this._ended = true; this._endedAt = Date.now();
    if (this._win) this._win.clearTimeout(this._endTimer);
    var v = this.vid();
    if (v && !v.ended && v.duration) { try { v.pause(); v.currentTime = v.duration; } catch (e) {} }
    this.lock(false);
    this.update();
  }
  startIntro() {
    var self = this, v = this.vid(), win = this._win; if (!v || !win) return;
    this._ended = false; this._fast = false;
    this.lock(true);
    try { v.playbackRate = 1; v.currentTime = 0; } catch (e) {}
    try { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {}
    win.clearTimeout(this._endTimer);
    this._endTimer = win.setTimeout(function () { self.finishIntro(); }, 14000);
    this.update();
  }
  replay() { if (this.scEl) this.scEl.scrollTop = 0; this.startIntro(); }
  maybeReplay() {
    if (this._replayed || !this._ended || this._reduce || !this.scEl) return;
    if (this.scEl.scrollTop > 10 || Date.now() - this._endedAt < 2500) return;
    if (this.g('menu', false)) return;
    this._replayed = true;
    this.startIntro();
  }
  jumpTo(id) {
    var self = this, sc = this.scEl, root = this.rootEl; if (!sc || !root) return;
    this._ended = true; this._endedAt = Date.now();
    if (this._win) this._win.clearTimeout(this._endTimer);
    var v = this.vid();
    if (v) { var toEnd = function () { try { v.pause(); v.currentTime = v.duration; } catch (e) {} }; if (v.readyState >= 1) toEnd(); else v.addEventListener('loadedmetadata', toEnd, { once: true }); }
    this.lock(false);
    var el = root.querySelector('#' + id);
    if (el) {
      var k = this.k();
      sc.scrollTop = sc.scrollTop + (el.getBoundingClientRect().top - sc.getBoundingClientRect().top) / k - (id === 'hero' ? 0 : 72);
    }
    this.update();
  }
  k() { var r = this.rootEl.getBoundingClientRect(); return (r.width / 390) || 1; }
  bind() {
    var self = this, root = this.rootEl; if (!root) return;
    var v = this.vid();
    if (v && !v._ddBound) {
      v._ddBound = true; v.muted = true; v.playsInline = true;
      v.addEventListener('ended', function () { self.finishIntro(); });
      v.addEventListener('error', function () { self.finishIntro(); });
      var start = (this.props && this.props.startAt) || 'intro';
      if (start === 'intro' && !this._reduce) this.startIntro();
    }
    var hv = root.querySelectorAll('video[data-hv]');
    for (var i = 0; i < hv.length; i++) {
      var x = hv[i];
      if (x._ddBound) continue;
      x._ddBound = true; x.muted = true; x.loop = true; x.playsInline = true;
      x.addEventListener('playing', function () { if (this.parentNode) this.parentNode.setAttribute('data-playing', 'true'); });
      x.addEventListener('pause', function () { if (this.parentNode) this.parentNode.setAttribute('data-playing', 'false'); });
    }
    this.bindDrag();
    this.update();
  }
  bindDrag() {
    var self = this, root = this.rootEl;
    var view = root.querySelector('[data-el="cg-view"]'), track = root.querySelector('[data-el="cg-track"]');
    if (!view || !track || view._ddDrag) return;
    view._ddDrag = true;
    var TR = 'transform 450ms cubic-bezier(0.22,1,0.36,1)', STEP = 296, MAX = 5;
    var st = null, moved = false;
    view.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      st = { x: e.clientX, y: e.clientY, base: self.g('slide', 0) * STEP, id: e.pointerId, active: false, k: self.k() };
      moved = false;
    });
    view.addEventListener('pointermove', function (e) {
      if (!st) return;
      var dx = (e.clientX - st.x) / st.k, dy = (e.clientY - st.y) / st.k;
      if (!st.active) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { st = null; return; }
        st.active = true; moved = true;
        try { view.setPointerCapture(st.id); } catch (err) {}
        view.classList.add('dragging');
        track.style.transition = 'none';
      }
      var off = st.base - dx, maxOff = MAX * STEP;
      if (off < 0) off = off / 3; else if (off > maxOff) off = maxOff + (off - maxOff) / 3;
      track.style.transform = 'translateX(' + (-off) + 'px)';
    });
    var end = function (e) {
      if (!st) return;
      if (st.active) {
        var dx = (e.clientX - st.x) / st.k;
        var cur = st.base / STEP;
        var target = Math.round((st.base - dx) / STEP);
        if (Math.abs(dx) > 40 && target === cur) target += dx < 0 ? 1 : -1;
        target = Math.max(0, Math.min(MAX, target));
        view.classList.remove('dragging');
        track.style.transition = TR;
        track.style.transform = 'translateX(' + (-target * STEP) + 'px)';
        try { view.releasePointerCapture(st.id); } catch (err) {}
        self.setState({ slide: target });
      }
      st = null;
    };
    view.addEventListener('pointerup', end);
    view.addEventListener('pointercancel', end);
    view.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    view.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }
  update() {
    var root = this.rootEl, sc = this.scEl; if (!root || !sc) return;
    var q = function (s) { return root.querySelector(s); };
    var cl = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var K = this.k(), RR = root.getBoundingClientRect(), S0 = sc.getBoundingClientRect();
    var rel = function (el) { var r = el.getBoundingClientRect(); return { top: (r.top - S0.top) / K, left: (r.left - RR.left) / K, width: r.width / K, height: r.height / K }; };
    var vh = sc.clientHeight || 844, W = 390, y = sc.scrollTop || 0;
    var i, k;

    /* Intro → the animation's last frame flies into the header */
    var hd = q('[data-el="header"]'), hl = q('[data-el="header-logo"]'), fs = q('[data-el="fly-logo"]'), bar = q('[data-el="mbar"]');
    var vid = q('[data-el="intro-video"]'), hint = q('[data-el="intro-hint"]');
    if (hd && hl && fs) {
      var ended = this._ended;
      var p = ended ? cl(y / (vh * 0.6), 0, 1) : 0, e = ease(p);
      var s = Math.min(W / 1920, vh / 1080), ox = (W - 1920 * s) / 2, oy = (vh - 1080 * s) / 2;
      var sL = ox + 42 * s, sT = oy + 36 * s - y, sW = 1837 * s;
      var r = rel(hl);
      fs.style.width = lerp(sW, r.width || 116, e) + 'px';
      fs.style.transform = 'translate3d(' + lerp(sL, r.left, e) + 'px,' + lerp(sT, r.top, e) + 'px,0)';
      fs.style.opacity = (ended && p > 0.001 && p < 0.999) ? '1' : '0';
      hl.style.opacity = (ended && p >= 0.999) ? '1' : '0';
      if (vid) vid.style.opacity = (ended && p > 0.001) ? '0' : '1';
      var ho = cl((p - 0.55) / 0.45, 0, 1);
      hd.style.opacity = String(ho);
      hd.style.pointerEvents = ho > 0.6 ? 'auto' : 'none';
      if (bar) { var bo = cl((p - 0.7) / 0.3, 0, 1); bar.style.opacity = String(bo); bar.style.pointerEvents = bo > 0.6 ? 'auto' : 'none'; }
      if (hint) hint.style.opacity = ended ? String(1 - cl(p / 0.08, 0, 1)) : '0';
    }

    /* 01 — title reveals word by word */
    var mt = q('[data-el="mt-track"]');
    if (mt) {
      var mr = rel(mt);
      var tp = cl(-mr.top / Math.max(1, mr.height - vh), 0, 1);
      var ws = mt.querySelectorAll('[data-mt-w]');
      for (i = 0; i < ws.length; i++) {
        k = +ws[i].getAttribute('data-mt-w');
        var wi = cl((tp - 0.06 - k * 0.09) / 0.14, 0, 1);
        ws[i].style.opacity = String(wi);
        ws[i].style.transform = 'translateY(' + ((1 - wi) * 28) + 'px)' + (k === 5 ? ' scale(' + (0.82 + 0.18 * wi) + ')' : '');
      }
    }

    /* 01 — problem statements with live typing */
    var st = q('[data-el="st-track"]');
    if (st) {
      var sr = rel(st);
      var sp = cl(-sr.top / Math.max(1, sr.height - vh), 0, 1);
      var u = sp * 4, idx = Math.min(3, Math.floor(u)), loc = u - idx;
      if (sp >= 1) { idx = 3; loc = 1; }
      var imgs = st.querySelectorAll('[data-st-img]');
      for (i = 0; i < imgs.length; i++) imgs[i].setAttribute('data-active', i === idx ? 'true' : 'false');
      var lines = st.querySelectorAll('[data-st-line]');
      for (i = 0; i < lines.length; i++) {
        var state = i < idx ? 'past' : (i === idx ? 'current' : 'future');
        if (lines[i].getAttribute('data-state') !== state) lines[i].setAttribute('data-state', state);
        var span = lines[i].querySelector('[data-st-text]');
        var full = span.getAttribute('data-text') || '';
        var n = state === 'past' ? full.length : (state === 'current' ? Math.round(full.length * cl(loc / 0.55, 0, 1)) : 0);
        var txt = full.slice(0, n);
        if (span.textContent !== txt) span.textContent = txt;
      }
      var ticks = st.querySelectorAll('[data-st-tick]');
      for (i = 0; i < ticks.length; i++) ticks[i].setAttribute('data-on', i <= idx ? 'true' : 'false');
      var scn = q('[data-el="st-count"]'); if (scn) scn.textContent = (idx + 1) + ' of 4';
    }

    /* 02 — video collages slide in from the right */
    var hw = q('[data-el="hw-track"]');
    if (hw) {
      var hr = rel(hw);
      var range = Math.max(1, hr.height - vh + vh * 0.5);
      var uu = cl((-hr.top + vh * 0.5) / range, 0, 1) * 5;
      var act = Math.min(4, Math.floor(uu));
      var near = hr.top < vh && hr.top + hr.height > 0;
      var bs = hw.querySelectorAll('[data-batch]');
      for (i = 0; i < bs.length; i++) {
        var en = cl((uu - i) / 0.4, 0, 1), ex = i < 4 ? cl((uu - i - 1) / 0.4, 0, 1) : 0;
        var tx = (1 - ease(en)) * 110 - ease(ex) * 35;
        var op = en > 0 ? 1 - ex : 0;
        bs[i].style.transform = 'translate3d(' + tx + '%,0,0)';
        bs[i].style.opacity = String(op);
        var vids = bs[i].querySelectorAll('video');
        for (k = 0; k < vids.length; k++) {
          if (near && i === act && op > 0.05) { if (vids[k].paused) { try { var pp = vids[k].play(); if (pp && pp.catch) pp.catch(function () {}); } catch (err) {} } }
          else if (!vids[k].paused) vids[k].pause();
        }
      }
      var cards = hw.querySelectorAll('[data-hcard]');
      for (i = 0; i < cards.length; i++) cards[i].setAttribute('data-active', i === act ? 'true' : 'false');
      var ht = hw.querySelectorAll('[data-htick]');
      for (i = 0; i < ht.length; i++) ht[i].setAttribute('data-on', i <= act ? 'true' : 'false');
      var hc = q('[data-el="hw-count"]'); if (hc) hc.textContent = (act + 1) + ' of 5';
    }

    /* 04 — glowing heartbeat travels down the steps */
    var list = q('[data-el="hiw"]'), pulse = q('[data-el="hiw-pulse"]'), fill = q('[data-el="hiw-fill"]');
    if (list && pulse && fill) {
      var lr = rel(list);
      var nodes = list.querySelectorAll('[data-hiw-node]');
      var py = cl(vh * 0.55 - lr.top, 0, lr.height);
      pulse.style.transform = 'translate(-50%,' + (py - 56) + 'px)';
      fill.style.height = Math.max(0, py - 38) + 'px';
      for (i = 0; i < nodes.length; i++) {
        var nr = rel(nodes[i]);
        var c = nr.top + nr.height / 2 - lr.top;
        nodes[i].setAttribute('data-lit', py >= c - 10 ? 'true' : 'false');
      }
    }
  }
  quizVals(open) {
    var self = this;
    var step = this.g('qStep', 1), A1 = this.g('qA1', ''), A2 = this.g('qA2', []), A3 = this.g('qA3', ''), A4 = this.g('qA4', ''), A5 = this.g('qA5', ''), AO = this.g('qOther', ''), QE = this.g('qErr', '');
    var P = ({ parent: ['your parent', 'they', 'them', "they're", 'their', 'themselves'], spouse: ['your spouse or partner', 'they', 'them', "they're", 'their', 'themselves'], self: ['you', 'you', 'you', "you're", 'your', 'yourself'] })[A1] || ['your loved one', 'they', 'them', "they're", 'their', 'themselves'];
    var fill = function (s) { return s.replace(/\{lovedOne\}/g, P[0]).replace(/\{they\}/g, P[1]).replace(/\{them\}/g, P[2]).replace(/\{theyre\}/g, P[3]).replace(/\{their\}/g, P[4]).replace(/\{themselves\}/g, P[5]); };
    var has = function (v) { return A2.indexOf(v) >= 0; };
    var Q = {
      1: { title: 'Who is the care for?', helper: 'Tap an answer to keep going.', type: 'single', key: 'qA1', val: A1, cols: 'repeat(2,minmax(0,1fr))', opts: [['parent', 'My parent', ''], ['spouse', 'My spouse or partner', ''], ['self', 'Myself', ''], ['someone-else', 'Someone else', '']] },
      2: { title: "What's happening right now?", helper: 'Choose all that apply.', type: 'multi', cols: 'repeat(2,minmax(0,1fr))', opts: [['bath', 'Bathing or dressing is getting hard', ''], ['house', 'The house is getting hard to keep up', ''], ['lonely', 'Feeling lonely or cut off', ''], ['hospital', 'Just home from the hospital or rehab', 'Or coming home soon'], ['night', 'Not safe alone at night', ''], ['break', 'A family caregiver needs a break', ''], ['hospice', 'On hospice or palliative care', ''], ['else', 'Something else', "Or I'm not sure"]] },
      3: { title: 'How much help do you think is needed?', helper: 'A rough idea is fine. You can change it later.', type: 'single', key: 'qA3', val: A3, cols: 'minmax(0,1fr)', opts: [['few-week', 'A few hours a week', 'Like 3 hours, twice a week'], ['few-days', 'A few hours most days', 'Like 4 hours, 5 days a week'], ['full', 'Full days', 'Like 8 hours, 5 days a week'], ['clock', 'Around the clock', 'Day and night, 7 days a week'], ['unsure', 'Not sure yet', "We'll work it out together"]] },
      4: { title: 'When would you like care to start?', helper: 'Tap an answer to keep going.', type: 'single', key: 'qA4', val: A4, cols: 'repeat(2,minmax(0,1fr))', opts: [['asap', 'As soon as possible', ''], ['two-weeks', 'Within 2 weeks', ''], ['month', 'Within a month', ''], ['exploring', 'Just exploring', '']] },
      5: { title: A1 === 'self' ? 'Where do you live?' : 'Where do they live?', helper: A1 === 'self' ? 'So we can check we reach your town.' : 'So we can check we reach their town.', type: 'select', cols: 'minmax(0,1fr)', opts: [] }
    };
    var cur = Q[Math.min(step, 5)];
    var opts = cur.opts.map(function (o, i) {
      var sel = cur.type === 'multi' ? has(o[0]) : cur.val === o[0];
      return {
        label: o[1], sub: o[2], hasSub: !!o[2], sel: sel, pressed: sel ? 'true' : 'false',
        border: sel ? '2px solid #2A1856' : '1.5px solid #5B5670', bg: sel ? '#EEE9F8' : '#FFFFFF',
        iP: step === 1 && i === 0, iS: step === 1 && i === 1, iM: step === 1 && i === 2, iE: step === 1 && i === 3,
        pick: function () {
          if (cur.type === 'multi') {
            var next = A2.slice(); var at = next.indexOf(o[0]);
            if (at >= 0) next.splice(at, 1); else next.push(o[0]);
            self.setState({ qA2: next, qErr: '' });
          } else {
            var ch = {}; ch[cur.key] = o[0]; ch.qErr = ''; self.setState(ch);
            setTimeout(function () { self.setState({ qStep: step + 1 }); }, 300);
          }
        }
      };
    });
    var contDisabled = step === 2 ? A2.length === 0 : (step === 5 ? !A5 : false);
    var z = {
      yes: true,
      asking: step <= 5, done: step > 5,
      progressText: 'Question ' + Math.min(step, 5) + ' of 5',
      pct: Math.min(step, 5) * 20,
      canBack: step > 1 && step <= 5,
      back: function () { self.setState({ qStep: Math.max(1, step - 1), qErr: '' }); },
      title: cur.title, helper: cur.helper, cols: cur.cols,
      isOptions: cur.type !== 'select', isSelect: cur.type === 'select', isQ1: step === 1,
      options: opts,
      hasContinue: step === 2 || step === 5,
      contLabel: step === 5 ? 'See my suggestion' : 'Continue',
      contDisabled: contDisabled ? 'true' : 'false',
      cont: function () {
        if (step === 2) { if (A2.length === 0) self.setState({ qErr: 'Please choose at least one — or choose "Something else."' }); else self.setState({ qStep: 3, qErr: '' }); }
        else if (step === 5) { if (!A5) self.setState({ qErr: 'Please choose a town — or choose "Not sure."' }); else self.setState({ qStep: 6, qErr: '' }); }
      },
      hasError: !!QE, error: QE,
      a5: A5, other: AO, showOther: A5 === 'else',
      setTown: function (e) { self.setState({ qA5: e.target.value, qErr: '' }); },
      setOther: function (e) { self.setState({ qOther: e.target.value }); }
    };

    /* scoring */
    var SV = {
      TF: { name: '24-Hour & Overnight Care', href: '/care/24-hour-care', promise: 'Someone there, day and night.', intro: 'A caregiver through the night, or around the clock in shifts — so {theyre} never alone when it matters most.', bullets: ['Overnight care, bedtime to morning', 'Safe nighttime bathroom trips', 'Shifts covered 7 days a week'], pair: ['PC', 'Help with bathing and dressing, morning and night.'] },
      RE: { name: 'Respite Care', href: '/care/respite-care', promise: 'A break for you. Your loved one keeps their routine.', intro: 'We step in for a few hours, a weekend or longer, so the family caregiver can rest — and the routine at home stays the same.', bullets: ['A few hours, a weekend or longer', 'Regular breaks or one-time cover', 'Any of our care while the family caregiver is away'], pair: ['PC', 'Hands-on help with bathing and dressing while the family caregiver is away.'] },
      PC: { name: 'Personal Care', href: '/care/personal-care', promise: 'Help with bathing, dressing and getting around — with dignity.', intro: 'Gentle, hands-on help with the daily things that have gotten harder — so {they} can stay home and stay {themselves}.', bullets: ['Bathing and showering, safely', 'Dressing and grooming', 'Using the bathroom and moving around the house'], pair: ['HH', 'Meals, laundry and medication reminders on the same visit.'] },
      HH: { name: 'Home Help', href: '/care/home-help', promise: 'Meals, laundry, errands and medication reminders, so the house keeps running.', intro: 'Help with the everyday things that keep a home safe, comfortable and {their} own.', bullets: ['Meals planned and cooked', 'Laundry and light housekeeping', 'Groceries, errands and medication reminders'], pair: ['CO', 'Someone to talk to while the chores get done.'] },
      CO: { name: 'Companionship', href: '/care/companionship', promise: 'Company, conversation and getting out of the house.', intro: 'Regular, friendly visits that give {them} good company and something to look forward to.', bullets: ['Conversation and good company', 'Games, puzzles, music and hobbies', 'Daily walks and trips to the park'], pair: ['HH', 'Lunch cooked, laundry done and a good chat, all in one visit.'] }
    };
    var ORDER = ['TF', 'RE', 'PC', 'HH', 'CO'];
    var score = { TF: 0, RE: 0, PC: 0, HH: 0, CO: 0 }, why = { TF: [], RE: [], PC: [], HH: [], CO: [] };
    var add = function (k, pts, line) { score[k] += pts; why[k].push(fill(line)); };
    if (has('bath')) add('PC', 3, 'You said bathing or dressing is getting hard.');
    if (has('house')) add('HH', 3, 'You said the house is getting hard to keep up.');
    if (has('lonely')) add('CO', 3, "You said {theyre} feeling lonely or cut off.");
    if (has('hospital')) { add('PC', 3, "You said {theyre} just home from the hospital or rehab, or coming home soon."); add('HH', 2, 'Coming home is easier when meals, laundry and errands are taken care of.'); }
    if (has('night')) add('TF', 3, "You said {theyre} not safe alone at night.");
    if (has('break')) add('RE', 3, 'You said a family caregiver needs a break.');
    if (has('hospice')) { add('CO', 3, "You said {theyre} on hospice or palliative care."); add('RE', 1, 'A break for the family during a hard time.'); }
    if (A3 === 'clock') add('TF', 3, 'You said {they} may need help around the clock.');
    var ranked = ORDER.slice().sort(function (a, b) { return (score[b] - score[a]) || (ORDER.indexOf(a) - ORDER.indexOf(b)); });
    var primary = score[ranked[0]] > 0 ? ranked[0] : null;
    var also = [];
    if (primary) {
      ranked.slice(1).forEach(function (k) { if (score[k] > 0 && also.length < 2) also.push({ name: SV[k].name, line: why[k][0], href: SV[k].href, link: 'See ' + SV[k].name }); });
      if (!also.length) { var pk = SV[primary].pair; also.push({ name: SV[pk[0]].name, line: pk[1], href: SV[pk[0]].href, link: 'See ' + SV[pk[0]].name }); }
    }
    var notes = [];
    if (has('night') && (A3 === 'few-week' || A3 === 'few-days')) notes.push({ t: fill("Nights usually need more than a few hours of help. We'll work out a schedule that keeps {them} safe after dark.") });
    if (has('hospital')) notes.push({ t: 'Still in the hospital or rehab? Call us before discharge if you can, so we can plan the first days home.' });
    if (has('hospice')) notes.push({ t: "All our care is non-medical. We don't replace the hospice team. Tell us who's on it, and we'll talk honestly about whether and how we can help." });
    if (has('else') && A2.length > 1) notes.push({ t: "You also said something else is going on. Tell us about it when we talk — we'll build it into the plan." });
    var HOURS = { 'few-week': 'About 6 hours a week to start — like 3 hours, twice a week.', 'few-days': 'About 20 hours a week to start — like 4 hours, 5 days a week.', full: 'About 40 hours a week to start — like 8 hours, 5 days a week.', clock: 'Care around the clock — 168 hours a week, covered in shifts so a rested caregiver is always there.', unsure: "Not sure about hours yet? That's normal. We'll work it out together at your free visit." };
    var URG = {
      asap: ['Need care soon?', open ? 'The quickest way to start is a phone call. Our office is open now: (843) 379-3321.' : "Our office is closed right now. Request a callback and we'll reach you first thing Monday at 8 AM."],
      'two-weeks': ['Starting in the next couple of weeks?', "The free visit is the first step. Book it now, and we'll plan the rest together."],
      month: ['Planning ahead?', "Good thinking. Book your free visit now, and start care when you're ready."],
      exploring: ['Just looking for now?', "That's fine — no pressure. Email yourself this plan, and come back when you're ready."]
    };
    var u = URG[A4] || URG.exploring;
    var townLine = A5 === 'else' ? (AO ? "We'll check whether we can reach " + AO + ' when we talk.' : fill("We'll check whether we can reach {their} town when we talk.")) : '';
    var p = primary ? SV[primary] : null;
    z.r = {
      hasPrimary: !!primary, together: !primary,
      headline: primary ? fill("Here's what we'd suggest for {lovedOne}.") : "Let's figure it out together.",
      intro: primary ? fill("Based on your answers. It's a starting point, not a package — every plan is built around {lovedOne} at a free visit.") : "Your answers don't point to one kind of help — and that's completely normal. Most families combine two or three. At a free visit, our owner will help you work out exactly what fits.",
      name: p ? p.name : '', promise: p ? p.promise : '', introLine: p ? fill(p.intro) : '', href: p ? p.href : '/care', link: p ? 'See ' + p.name : '',
      bullets: p ? p.bullets.map(function (b) { return { t: b }; }) : [],
      reasons: primary ? why[primary].map(function (t) { return { t: t }; }) : [],
      hasAlso: also.length > 0, also: also,
      all: ORDER.slice(2).concat(['RE', 'TF']).map(function (k) { return { name: SV[k].name, promise: SV[k].promise, href: SV[k].href, link: 'See ' + SV[k].name }; }),
      notes: notes, hasNotes: notes.length > 0,
      hours: HOURS[A3] || HOURS.unsure,
      urgH: u[0], urgText: u[1], urg911: A4 === 'asap',
      hasTown: !!townLine, townLine: townLine,
      nextText: fill('Our owner comes to {their} home, meets the family and builds the plan with you. Free, with no obligation.'),
      change: function () { self.setState({ qStep: 1, qErr: '' }); },
      restart: function () { self.setState({ qStep: 1, qA1: '', qA2: [], qA3: '', qA4: '', qA5: '', qOther: '', qErr: '' }); }
    };
    return z;
  }

  renderVals() {
    var self = this;
    var P = this.props || {};
    var open = (P.office || 'open') !== 'closed';
    var pending = P.showPending !== false;
    var family = P.heroHeadline === 'family-run';
    var slide = this.g('slide', 0);
    var flipped = this.g('flipped', -1);
    var faq = this.g('faq', 0);
    var hours = this.g('hours', 4);
    var days = this.g('days', 5);
    var overnight = this.g('overnight', false);
    var effHours = overnight ? 24 : hours;
    var weekly = effHours * days;
    var year = new Date().getFullYear();
    var townQ = this.g('townQ', '');
    var townRes = this.g('townRes', '');
    var paused = this.g('paused', false);
    var lic = this.g('lic', true);
    var tr = this.g('tr', false);
    var menu = this.g('menu', false);
    var maxSlide = 5;

    var REV = [
      ['Linda Pienik', "I call Dawson agency Angels on the ground .They help me thru a tough situation with my elderly Mother they were there thru physical and mental experience. Thanking again for all making My Mother happy comfortable and knowing she was safe and in good hands Linda Pienik"],
      ['Ali Holroyde', 'Dawson & Dawson is fantastic and has provided incredible care for our in-laws. They are reliable, skilled, and have been a huge gift to our family!'],
      ['Holly Herring', 'Monique and her business have been an answer to our prayers. She has worked with our family for over a year and enabled our mother to thrive with her new health challenges. She is intuitive and receptive to her changing needs . My mother …'],
      ['Mary Wilkie', 'Dawson and Dawson provided excellent service for my husband during a very difficult time. They guided myself and my sons through a very trying time. My husband was treated with great respect and dignity. My mind was eased so much with all of their assistance. I would highly recommend Dawson and Dawson.'],
      ['Kathy McTeer', 'Dawson and Dawson Home Health Care was referred to me by a neighbor. They provided excellent care for my husband. I would like to point out that both Yulaunda and Molly are the absolute best when it comes to caring for your loved ones. The care that they both showed when caring for my husband was beyond their scope of work!'],
      ['Maureen McNeill', "During the latest storm, Dawson and Dawson provided continuous care, despite the difficult weather conditions. They made sure my elderly Mother had the care she needed. The wonderful caregivers went above and beyond to keep my Mother safe and comfortable. I can’t emphasize enough their exceptional service."],
      ['Penny Barrett', 'Dawson & Dawson followed my husband in continuing care, and they were excellent at keeping him clean and presentable. Monique kept us up to date on any changes in medications, and she was excellent in answering our questions. Several of her caregivers were quite adept at refocusing him when he tired out. Thank you, Monique, and your crew!'],
      ['Virginia Lurcott', 'Monique Dawson and her staff have been a pleasure to work with. Each one offers a warm willingness to assist whenever I call. They make every effort to resolve any issue. Grateful for their service. Virginia Lurcott'],
      ['Allison Godfrey', 'I would give Monique and Jay 10 stars if I could. They are extremely professional and dedicated to the care service they provide. They both escorted each new caregiver to ensure the best experience possible. Top class.'],
      ['Jim Happ', 'The staff at Dawson and Dawson did a fabulous job caring for my mother for two years before her passing. Excellent communications and completely trustworthy. Their help allowed her to live out her days in the place she loved…']
    ];
    var COLORS = ['#4B2E91', '#8E3BA8', '#4A7309', '#2A1856'];
    var reviews = [];
    for (var rr = 0; rr < 20; rr++) {
      var R = REV[rr % 10];
      reviews.push({ name: R[0], initial: R[0].charAt(0), text: R[1], color: COLORS[rr % 4], hidden: rr >= 10 ? 'true' : 'false' });
    }

    var qz = this.quizVals(open);
    qz.cols = 'minmax(0,1fr)';

    var v = {
      rootRef: function (node) { self.rootEl = node; },
      scRef: function (node) { self.scEl = node; },
      yes: true,
      isOpen: open, isClosed: !open,
      pending: pending, noPending: !pending,
      heroOwner: !family, heroFamily: family,
      years: year - 2002, currentYear: year,
      qz: qz,

      menuOpen: menu, menuClosed: !menu, menuExpanded: menu ? 'true' : 'false',
      menuLabel: menu ? 'Close menu' : 'Open menu',
      toggleMenu: function () { self.setState({ menu: !menu }); },
      closeMenu: function () { self.setState({ menu: false }); },

      slideOffset: slide * 296,
      slidePos: (slide + 1) + ' of 6',
      slideFirst: slide === 0 ? 'true' : 'false',
      slideLast: slide >= maxSlide ? 'true' : 'false',
      prevSlide: function () { if (slide > 0) self.setState({ slide: slide - 1 }); },
      nextSlide: function () { if (slide < maxSlide) self.setState({ slide: slide + 1 }); },
      slides: [0, 1, 2, 3, 4, 5].map(function (n) {
        var f = flipped === n;
        return { flipped: f ? 'true' : 'false', flip: function () { self.setState({ flipped: f ? -1 : n }); } };
      }),

      reviews: reviews,
      paused: paused, notPaused: !paused, pausedStr: paused ? 'true' : 'false',
      togglePause: function () { self.setState({ paused: !paused }); },

      licOpen: lic, licExpanded: lic ? 'true' : 'false',
      toggleLic: function () { self.setState({ lic: !lic }); },
      trOpen: tr, trExpanded: tr ? 'true' : 'false',
      trLabel: tr ? 'Hide the transcript' : 'Read the transcript',
      toggleTr: function () { self.setState({ tr: !tr }); },

      hoursVal: effHours,
      hoursText: effHours + ' hours',
      hoursValueText: effHours + ' hours per visit',
      hoursPct: Math.round((effHours - 2) / 22 * 100),
      setHours: function (e) { var n = parseInt(e.target.value, 10); if (!isNaN(n)) self.setState({ hours: n }); },
      overnight: overnight,
      overnightStr: overnight ? 'true' : 'false',
      toggleOvernight: function () { self.setState({ overnight: !overnight }); },
      switchBg: overnight ? '#2A1856' : '#FFFFFF',
      switchBorder: overnight ? '2px solid #2A1856' : '1.5px solid #5B5670',
      knobLeft: overnight ? 32 : 4,
      knobBg: overnight ? '#FFFFFF' : '#5B5670',
      daysText: days + (days === 1 ? ' day' : ' days'),
      daysMin: days <= 1 ? 'true' : 'false',
      daysMax: days >= 7 ? 'true' : 'false',
      fewerDays: function () { if (days > 1) self.setState({ days: days - 1 }); },
      moreDays: function () { if (days < 7) self.setState({ days: days + 1 }); },
      weeklyHours: weekly,
      scalePct: Math.max(3, Math.round(weekly / 168 * 100)),
      liveText: weekly + ' hours a week. About $[weekly min] to $[weekly max] a week.',

      townQ: townQ,
      townInput: function (e) { self.setState({ townQ: e.target.value, townRes: '' }); },
      townSubmit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ townRes: (townQ || '').trim() ? 'nomatch' : 'empty' }); },
      townEmpty: townRes === 'empty',
      townNoMatch: townRes === 'nomatch',
      townInvalid: townRes === 'empty' ? 'true' : 'false',
      townBorder: townRes === 'empty' ? '2px solid #B42318' : '1.5px solid #5B5670'
    };
    for (var f = 0; f < 6; f++) {
      (function (n) {
        var o = faq === n;
        v['fq' + n] = { open: o, exp: o ? 'true' : 'false', rot: o ? 'rotate(180deg)' : 'rotate(0deg)', toggle: function () { self.setState({ faq: o ? -1 : n }); } };
      })(f);
    }
    return v;
  }
}


/* fit the 390 x 844 phone frame to the window */
(function () {
  function fit() {
    var s = Math.min(1, window.innerWidth / 390, window.innerHeight / 844);
    if (window.innerWidth <= 430) s = Math.min(window.innerWidth / 390, window.innerHeight / 844);
    document.documentElement.style.setProperty('--phone-scale', String(s));
  }
  fit(); window.addEventListener('resize', fit);
})();
DCMount(Component, {"office": {"editor": "enum", "options": ["open", "closed"], "default": "open", "section": "States"}, "showPending": {"editor": "boolean", "default": true, "section": "States"}, "heroHeadline": {"editor": "enum", "options": ["owner", "family-run"], "default": "owner", "section": "States"}, "startAt": {"editor": "enum", "options": ["intro", "hero", "the-moment", "how-we-help", "find-care", "how-it-works", "reviews", "where-we-care", "final-cta"], "default": "intro", "section": "Preview"}});
