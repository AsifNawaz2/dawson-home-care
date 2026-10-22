/* Free In-Home Care Assessment | Dawson & Dawson, Beaufort SC — page logic (scroll animations, interactions, states) */
class Component extends DCLogic {
  g(k, d) { var s = this.state; return (s && s[k] !== undefined) ? s[k] : d; }
  initial() {
    var P = this.props || {};
    var step = Math.max(1, Math.min(5, parseInt(P.startStep || '2', 10) || 2));
    var a = { care_for: '', loved: '', town: '', town_other: '', services: [], start: '', hours: '', hospital: false, first_name: '', last_name: '', phone: '', email: '', contact: '', best: '', notes: '', sms1: false, sms2: false };
    if (step > 1 || P.banner === 'quiz') { a.care_for = 'parent'; a.town = 'not-sure'; }
    if (P.banner !== 'none' && P.banner !== 'resume') a.services = ['personal-care'];
    if (step > 2) { if (!a.services.length) a.services = ['personal-care']; }
    if (step > 3) { a.start = 'two-weeks'; a.hours = 'few-hours-most-days'; }
    if (step > 4) { a.contact = 'call'; a.best = 'any'; }
    var st = { step: step, a: a, errs: {}, summaryOn: false, sending: false, sent: false, bannerOff: false, dob: false, suggest: '' };
    if (P.previewErrors) {
      if (step === 2) a.services = [];
      var list = this.validate(step, a); var e = {}; list.forEach(function (x) { e[x[0]] = x[1]; });
      st.errs = e; st.summaryOn = list.length > 0;
    }
    return st;
  }
  S() { if (!this._init) this._init = this.initial(); var s = this.state || {}; var b = this._init; var o = {}; for (var k in b) o[k] = (s[k] !== undefined) ? s[k] : b[k]; return o; }
  componentDidMount() {
    var self = this, root = this.rootEl; if (!root) return;
    var doc = root.ownerDocument, win = doc.defaultView || window;
    this._win = win; this._lastStep = this.S().step;
    this._propKey = this.propKey();
    this.initCursor();
  }
  propKey() { var P = this.props || {}; return [P.startStep, P.banner, P.previewErrors].join('|'); }
  componentDidUpdate() {
    var self = this;
    if (this.propKey() !== this._propKey) { this._propKey = this.propKey(); this._init = null; var n = this.initial(); this._lastStep = n.step; this.setState(n); return; }
    var s = this.S();
    if (this._focusSummary) { this._focusSummary = false; var es = this.rootEl.querySelector('[data-el="esum"]'); if (es) { try { es.focus({ preventScroll: true }); } catch (e) {} this.reveal(es); } }
    if (s.step !== this._lastStep || this._focusId) {
      this._lastStep = s.step;
      var id = this._focusId; this._focusId = null;
      var el = id ? this.rootEl.querySelector('#' + id) : this.rootEl.querySelector('[data-el="step-h"]');
      if (el && this._nav) { try { el.focus({ preventScroll: true }); } catch (e) {} this.reveal(s.sent ? (this.rootEl.querySelector('#form') || el) : el); }
    }

  }
  componentWillUnmount() {
    if (this.stopCursor) this.stopCursor();
  }
  set(ch) { var s = this.S(); var n = {}; for (var k in s.a) n[k] = s.a[k]; for (var j in ch) n[j] = ch[j]; return n; }
  digits(v) { var d = String(v || '').replace(/\D/g, ''); if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1); return d; }
  fmtPhone(v) {
    var raw = String(v || ''); if (/[a-zA-Z]/.test(raw)) return raw;
    if (/^\s*\+(?!1)/.test(raw)) return raw;
    var d = this.digits(raw); if (d.length > 10) return raw;
    if (d.length <= 3) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }
  check(field, a) {
    var v = a[field];
    if (field === 'care_for') return v ? '' : 'Please choose who the care is for.';
    if (field === 'town') return v ? '' : 'Please choose a town — or "Not sure."';
    if (field === 'services') return v.length ? '' : 'Please choose at least one — or "Not sure yet."';
    if (field === 'start') return v ? '' : "Please choose when you'd like care to start.";
    if (field === 'hours') return v ? '' : 'Please choose how much help you think is needed — or "Not sure yet."';
    if (field === 'contact') return v ? '' : "Please choose how you'd like us to reach you.";
    if (field === 'first_name') {
      v = String(v || '').trim();
      if (!v) return 'Please enter your first name.';
      if (v.length > 40) return 'Please keep this to 40 characters or fewer.';
      if (/https?:|www\.|\.com\b/i.test(v)) return 'Please enter a name, not a web address.';
      return '';
    }
    if (field === 'phone') {
      var raw = String(v || '').trim();
      if (!raw) return 'Please enter your phone number so we can call you back.';
      if (/^\+(?!1)/.test(raw)) return "Please enter a US phone number with an area code. If you're outside the US, email us at info@dawsonhomecare.com.";
      if (/[a-zA-Z]/.test(raw) || this.digits(raw).length !== 10) return 'Please enter a 10-digit phone number, like (843) 555-0123.';
      return '';
    }
    if (field === 'email') {
      var e = String(v || '').trim();
      if (!e) return a.contact === 'email' ? 'Please enter your email address.' : '';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? '' : 'Please enter an email address like name@example.com.';
    }
    if (field === 'notes') {
      var t = String(v || '');
      if (/\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/.test(t)) return 'Please remove the ID number. We never need it online.';
      if (/\b[1-9][A-Za-z][A-Za-z0-9]\d-?[A-Za-z][A-Za-z0-9]\d-?[A-Za-z]{2}\d{2}\b/.test(t)) return 'Please remove the Medicare number. We never need it online.';
      if (t.length > 1000) return 'Please keep this to 1,000 characters or fewer. You can tell us the rest on the phone.';
      return '';
    }
    return '';
  }
  validate(step, a) {
    var F = { 1: ['care_for', 'town'], 2: ['services'], 3: ['start', 'hours'], 4: ['first_name', 'phone', 'email', 'contact', 'notes'] };
    var steps = step === 5 ? [1, 2, 3, 4] : [step], out = [], self = this;
    steps.forEach(function (n) { (F[n] || []).forEach(function (f) { var m = self.check(f, a); if (m) out.push([f, m, n]); }); });
    return out;
  }
  reveal(el) {
    try { var r = el.getBoundingClientRect(), win = this._win || window; if (r.top < 120 || r.top > win.innerHeight * 0.6) win.scrollTo({ top: win.scrollY + r.top - 150, behavior: 'smooth' }); } catch (e) {}
  }
  formVals(open, pending) {
    var self = this, s = this.S(), a = s.a, step = s.step, errs = s.errs;
    var NAMES = ['Who', 'Help', 'Timing', 'You', 'Send'];
    var selfCare = a.care_for === 'self';
    var loved = String(a.loved || '').trim();
    var lovedName = loved || 'your loved one';
    var ANCHOR = { care_for: 'care-parent', town: 'town', services: 'svc-personal-care', start: 'start-asap', hours: 'hours-few-hours-week', first_name: 'first_name', phone: 'phone', email: 'email', contact: 'contact-call', notes: 'notes' };
    var FSTEP = { care_for: 1, town: 1, services: 2, start: 3, hours: 3, first_name: 4, phone: 4, email: 4, contact: 4, notes: 4 };
    var put = function (ch, extra) {
      var na = self.set(ch); var e = {}; for (var k in errs) e[k] = errs[k];
      for (var f in ch) { if (e[f] && !self.check(f, na)) delete e[f]; }
      if (ch.contact !== undefined && e.email && !self.check('email', na)) delete e.email;
      var o = { a: na, errs: e }; if (Object.keys(e).length === 0) o.summaryOn = false;
      if (extra) for (var x in extra) o[x] = extra[x];
      self.setState(o);
    };
    var err = function (f) { var m = errs[f] || ''; return { on: !!m, msg: m, inv: m ? 'true' : 'false', dby: m ? f + '-err' : '', border: m ? '2px solid #B42318' : '1.5px solid #5B5670' }; };
    var E = {}; ['care_for', 'town', 'services', 'start', 'hours', 'first_name', 'phone', 'email', 'contact', 'notes'].forEach(function (f) { E[f] = err(f); });
    var blur = function (f) { return function () {
      var m = self.check(f, a), e = {}; for (var k in errs) e[k] = errs[k];
      var touched = String(a[f] || '').length > 0 || f === 'first_name' || f === 'phone';
      if (m && touched) e[f] = m; else delete e[f];
      var o = { errs: e };
      if (f === 'notes') o.dob = /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.](19|20)?\d{2}\b/.test(String(a.notes || ''));
      if (f === 'email') {
        var em = String(a.email || '').trim(), sug = '';
        var fix = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.co': 'gmail.com', 'yaho.com': 'yahoo.com', 'hotmal.com': 'hotmail.com' };
        var at = em.lastIndexOf('@');
        if (at > 0) { var dom = em.slice(at + 1).toLowerCase(); if (fix[dom]) sug = em.slice(0, at + 1) + fix[dom]; else if (/\.con$/.test(dom)) sug = em.slice(0, -4) + '.com'; }
        o.suggest = sug;
      }
      self.setState(o);
    }; };
    var opt = function (list, field, pref, multi) {
      return list.map(function (o, i) {
        var on = multi ? a[field].indexOf(o[0]) >= 0 : a[field] === o[0];
        return { id: pref + o[0], v: o[0], label: o[1], title: o[1], help: o[2] || '', line: o[2] || '', on: on, pick: function () {
          if (!multi) { var c = {}; c[field] = o[0]; put(c); return; }
          var cur = a[field].slice(), at = cur.indexOf(o[0]);
          if (at >= 0) cur.splice(at, 1);
          else if (o[0] === 'not-sure') cur = ['not-sure'];
          else { cur = cur.filter(function (x) { return x !== 'not-sure'; }); cur.push(o[0]); }
          var c2 = {}; c2[field] = cur; put(c2);
        } };
      });
    };
    var CARE = [['parent', 'My parent'], ['spouse', 'My spouse or partner'], ['self', 'Myself'], ['someone-else', 'Someone else']];
    var SERV = [['personal-care', 'Personal Care', 'Bathing, dressing and getting around'], ['home-help', 'Home Help', 'Meals, laundry, errands and medication reminders'], ['companionship', 'Companionship', 'Company, conversation and getting out'], ['respite-care', 'Respite Care', 'A break for the family caregiver'], ['24-hour-care', '24-Hour & Overnight Care', 'Someone there, day and night']];
    if (pending) SERV.push(['hospice-support', 'Support alongside a hospice team', 'Non-medical comfort and company']);
    SERV.push(['not-sure', 'Not sure yet', 'Help me decide']);
    var START = [['asap', 'As soon as possible'], ['two-weeks', 'Within 2 weeks'], ['month', 'Within a month'], ['exploring', 'Just exploring']];
    var HOURS = [['few-hours-week', 'A few hours a week', 'Like 3 hours, twice a week'], ['few-hours-most-days', 'A few hours most days', 'Like 4 hours, 5 days a week'], ['full-days', 'Full days', 'Like 8 hours, 5 days a week'], ['around-the-clock', 'Around the clock', 'Day and night, 7 days a week'], ['not-sure', 'Not sure yet', "We'll work it out together"]];
    var CONTACT = [['call', 'Phone call'], ['text', 'Text message'], ['email', 'Email']];
    var BEST = [['morning', 'Morning (8–11 AM)'], ['midday', 'Midday (11 AM–2 PM)'], ['afternoon', 'Afternoon (2–5 PM)'], ['any', 'Any time']];
    var lab = function (list, v) { for (var i = 0; i < list.length; i++) if (list[i][0] === v) return list[i][1]; return ''; };
    var care = opt(CARE, 'care_for', 'care-');
    care.forEach(function (o, i) { o.i0 = i === 0; o.i1 = i === 1; o.i2 = i === 2; o.i3 = i === 3; o.bg = ['#EEE9F8', '#F6EAFB', '#EEF6DC', '#EEE9F8'][i]; });
    var serv = opt(SERV, 'services', 'svc-', true);
    var IC = { 'personal-care': 'iPC', 'home-help': 'iHH', companionship: 'iCO', 'respite-care': 'iRE', '24-hour-care': 'iTF', 'hospice-support': 'iHS', 'not-sure': 'iNS' };
    serv.forEach(function (o) { for (var k in IC) o[IC[k]] = o.v === k; o.hasTbc = o.v === 'hospice-support'; o.tbc = '[Hospice/palliative support — to confirm]'; });
    var join = function (arr) { if (arr.length < 2) return arr.join(''); return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1]; };
    var go = function (f) { return function (e) { if (e && e.preventDefault) e.preventDefault(); self._nav = true; self._focusId = ANCHOR[f]; self.setState({ step: FSTEP[f] }); }; };
    var list = s.summaryOn ? this.validate(step, a) : [];
    var townTxt = a.town === 'other' ? (String(a.town_other || '').trim() || 'Somewhere else') : (a.town === 'not-sure' ? 'Not sure' : '—');
    var notes = String(a.notes || '').trim();
    var reach = lab(CONTACT, a.contact) ? lab(CONTACT, a.contact) + ' at ' + ((a.contact === 'email' ? a.email : a.phone) || '—') : '—';
    var rowsDef = [
      ['Care is for', (lab(CARE, a.care_for) || '—') + (loved && !selfCare ? ', ' + loved : ''), 'Change who the care is for', 'care_for'],
      ['Town', townTxt, 'Change town', 'town'],
      ['Help with', join(a.services.map(function (v) { return lab(SERV, v); })) || '—', 'Change help', 'services'],
      ['Start', lab(START, a.start) || '—', 'Change start', 'start'],
      ['Hours', lab(HOURS, a.hours) || '—', 'Change hours', 'hours'],
      ['Your name', (String(a.first_name || '') + ' ' + String(a.last_name || '')).trim() || '—', 'Change your name', 'first_name'],
      ['Reach you by', reach, 'Change how we reach you', 'contact'],
      ['Best time', lab(BEST, a.best) || '—', 'Change best time', 'contact'],
      ['Notes', notes ? (notes.length > 120 ? notes.slice(0, 120) + '…' : notes) : '—', 'Change notes', 'notes']
    ];
    var first = String(a.first_name || '').trim();
    var verb = a.contact === 'email' ? 'email' : (a.contact === 'text' && a.sms1 ? 'text' : 'call');
    var heads = { 1: 'Who needs care?', 2: selfCare ? 'What kind of help might you need?' : 'What kind of help might ' + lovedName + ' need?', 3: 'When, and how much help?', 4: 'How can we reach you?', 5: 'Check and send.' };
    var mk = function (f) { return function (e) { var v = e && e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e; var c = {}; c[f] = f === 'phone' ? self.fmtPhone(v) : v; put(c, f === 'notes' ? { dob: false } : (f === 'email' ? { suggest: '' } : null)); }; };
    var setters = {}; ['loved', 'town', 'town_other', 'hospital', 'first_name', 'last_name', 'phone', 'email', 'notes', 'sms1', 'sms2'].forEach(function (f) { setters[f] = mk(f); });
    return {
      a: a, set: setters,
      blur: { town: blur('town'), first_name: blur('first_name'), phone: blur('phone'), email: blur('email'), notes: blur('notes') },
      err: E,
      sent: s.sent, notSent: !s.sent,
      thanks: first ? 'Thank you, ' + first + '.' : 'Thank you.',
      thanksLead: open ? "We've got your request. Our office is open now, so we'll " + verb + ' you as soon as we can.' : "We've got your request. Our office is closed right now, so we'll " + verb + ' you first thing Monday at 8 AM.',
      thanksPending: open && pending,
      progress: 'Step ' + step + ' of 5 · ' + NAMES[step - 1],
      pfrac: step / 5,
      pnames: NAMES.map(function (n, i) { return { n: n, w: i + 1 === step ? 700 : 500, c: i + 1 <= step ? '#2A1856' : '#5B5670' }; }),
      announce: 'Step ' + step + ' of 5: ' + heads[step],
      hasSummary: list.length > 0,
      summaryTitle: list.length === 1 ? 'Please check 1 answer before you ' + (step === 5 ? 'send.' : 'continue.') : 'Please check ' + list.length + ' answers before you ' + (step === 5 ? 'send.' : 'continue.'),
      summary: list.map(function (x) { return { msg: x[1], href: '#' + ANCHOR[x[0]], go: go(x[0]) }; }),
      s1: step === 1, s2: step === 2, s3: step === 3, s4: step === 4, s5: step === 5,
      care: care, showLoved: !selfCare, townLabel: selfCare ? 'Where do you live? (required)' : 'Where do they live? (required)',
      townHelp: selfCare ? 'So we can check we reach your town.' : 'So we can check we reach their town.',
      showOther: a.town === 'other',
      h2: heads[2], serv: serv,
      start: opt(START, 'start', 'start-'), hours: opt(HOURS, 'hours', 'hours-'), asap: a.start === 'asap',
      hospOn: a.hospital ? 'true' : 'false', hospLabel: selfCare ? "I'm in the hospital or rehab now, or just came home." : "They're in the hospital or rehab now, or just came home.",
      emailLabel: a.contact === 'email' ? 'Email (required)' : 'Email',
      hasSuggest: !!s.suggest, suggest: s.suggest, useSuggest: function () { put({ email: s.suggest }, { suggest: '' }); },
      contact: opt(CONTACT, 'contact', 'contact-'), textNote: a.contact === 'text',
      best: opt(BEST, 'best', 'best-'),
      showCount: String(a.notes || '').length >= 800, countText: Math.max(0, 1000 - String(a.notes || '').length) + ' characters left',
      dobNote: !!s.dob && !errs.notes,
      rows: rowsDef.map(function (r) { return { label: r[0], value: r[1], aria: r[2], go: go(r[3]) }; }),
      sms1On: a.sms1 ? 'true' : 'false', sms2On: a.sms2 ? 'true' : 'false',
      textReminder: a.contact === 'text' && !a.sms1,
      isSending: s.sending, sending: s.sending ? 'true' : 'false',
      sendingLive: s.sending ? 'Sending your request.' : '',
      nextLabel: step < 5 ? 'Continue' : (s.sending ? 'Sending…' : (open ? 'Send my request' : 'Request my callback')),
      canBack: step > 1 && !s.sending,
      saveNote: step < 5,
      back: function () { self._nav = true; self.setState({ step: Math.max(1, step - 1), errs: {}, summaryOn: false }); },
      next: function () {
        if (s.sending) return;
        var bad = self.validate(step, a);
        if (bad.length) {
          var e = {}; bad.forEach(function (x) { e[x[0]] = x[1]; });
          self._focusSummary = true; self.setState({ errs: e, summaryOn: true });
          return;
        }
        self._nav = true;
        if (step < 5) { self.setState({ step: step + 1, errs: {}, summaryOn: false }); return; }
        self.setState({ sending: true });
        (self._win || window).setTimeout(function () { self._nav = true; self._lastStep = -1; self.setState({ sending: false, sent: true }); }, 1400);
      }
    };
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
    var s = this.S();
    var banner = s.bannerOff ? 'none' : (P.banner || 'service page');
    var v = {
      rootRef: function (node) { self.rootEl = node; },
      yes: true,
      isOpen: open, isClosed: !open, pending: pending, noPending: !pending,
      currentYear: new Date().getFullYear(),
      f: this.formVals(open, pending),
      bService: banner === 'service page' && !s.sent, bQuiz: banner === 'quiz' && !s.sent, bResume: banner === 'resume' && !s.sent,
      dismiss: function () { self.setState({ bannerOff: true }); },
      pickUp: function () { self.setState({ bannerOff: true }); },
      startOver: function () { self._init = null; var n = self.initial(); n.a = { care_for: '', loved: '', town: '', town_other: '', services: [], start: '', hours: '', hospital: false, first_name: '', last_name: '', phone: '', email: '', contact: '', best: '', notes: '', sms1: false, sms2: false }; n.step = 1; n.errs = {}; n.summaryOn = false; n.bannerOff = true; self._nav = true; self.setState(n); }
    };
    v.closedPending = !open && pending; v.closedFinal = !open && !pending;
    v.ringRef = function (node) { self.ringEl = node; };
    return v;
  }
}

DCMount(Component, {"office": {"editor": "enum", "options": ["open", "closed"], "default": "open", "section": "States"}, "showPending": {"editor": "boolean", "default": true, "section": "States"}, "startStep": {"editor": "enum", "options": ["1", "2", "3", "4", "5"], "default": "2", "section": "Form"}, "banner": {"editor": "enum", "options": ["service page", "quiz", "resume", "none"], "default": "service page", "section": "Form"}, "previewErrors": {"editor": "boolean", "default": false, "section": "Form"}});
