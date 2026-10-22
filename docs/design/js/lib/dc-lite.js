/*
 * dc-lite.js — renders a page template (<template id="dc-template">) with its
 * Component logic (class Component extends DCLogic) using React 18.
 *
 * Template syntax:
 *   {{path.to.value}}             text or attribute value (attribute that is only a hole
 *                                 receives the raw value: functions, booleans, numbers)
 *   <sc-if value="{{flag}}">      renders children when truthy
 *   <sc-for list="{{items}}" as="item">  repeats children for each entry
 *
 * Page settings: defaults come from the page script; any of them can be overridden
 * with URL query parameters, e.g. ?office=closed&showPending=false
 */
(function () {
  'use strict';
  var R = window.React, RD = window.ReactDOM;
  if (!R || !RD) { throw new Error('dc-lite: React and ReactDOM must load first.'); }

  var HOLE_ONLY = /^\s*\{\{\s*([\w$.]+)\s*\}\}\s*$/;
  var HOLE = /\{\{\s*([\w$.]+)\s*\}\}/g;

  var ATTR = {
    'class': 'className', 'for': 'htmlFor', 'tabindex': 'tabIndex', 'maxlength': 'maxLength',
    'autocomplete': 'autoComplete', 'inputmode': 'inputMode', 'readonly': 'readOnly',
    'crossorigin': 'crossOrigin', 'datetime': 'dateTime', 'autoplay': 'autoPlay',
    'playsinline': 'playsInline', 'colspan': 'colSpan', 'rowspan': 'rowSpan', 'srcset': 'srcSet',
    'charset': 'charSet', 'xlink:href': 'xlinkHref',
    'onclick': 'onClick', 'onchange': 'onChange', 'onblur': 'onBlur', 'onfocus': 'onFocus',
    'onsubmit': 'onSubmit', 'oninput': 'onInput', 'onkeydown': 'onKeyDown', 'onkeyup': 'onKeyUp',
    'onmouseenter': 'onMouseEnter', 'onmouseleave': 'onMouseLeave', 'onpointerdown': 'onPointerDown',
    'onpointerup': 'onPointerUp', 'onpointerenter': 'onPointerEnter', 'onpointerleave': 'onPointerLeave'
  };
  var BOOL = { autoplay: 1, playsinline: 1, muted: 1, loop: 1, disabled: 1, checked: 1, readonly: 1, required: 1, hidden: 1, controls: 1, selected: 1, multiple: 1 };
  var SKIP = /^hint-/;

  function lookup(path, scope) {
    var parts = path.split('.'), cur = scope;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }
  function styleObj(str) {
    var out = {}, buf = '', depth = 0, parts = [];
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      if (ch === '(') depth++; else if (ch === ')') depth--;
      if (ch === ';' && depth === 0) { parts.push(buf); buf = ''; } else buf += ch;
    }
    parts.push(buf);
    parts.forEach(function (decl) {
      var at = decl.indexOf(':'); if (at < 0) return;
      var k = decl.slice(0, at).trim(), v = decl.slice(at + 1).trim();
      if (!k) return;
      if (k.indexOf('--') === 0) { out[k] = v; return; }
      if (k.indexOf('-webkit-') === 0) k = 'Webkit' + camel(k.slice(8)).replace(/^./, function (c) { return c.toUpperCase(); });
      else if (k.indexOf('-moz-') === 0) k = 'Moz' + camel(k.slice(5)).replace(/^./, function (c) { return c.toUpperCase(); });
      else k = camel(k);
      out[k] = v;
    });
    return out;
  }

  function props(el, scope, key) {
    var p = { key: key }, svg = el.namespaceURI === 'http://www.w3.org/2000/svg';
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i], name = a.name, raw = a.value;
      if (SKIP.test(name)) continue;
      var m = raw.match(HOLE_ONLY), val;
      if (m) val = lookup(m[1], scope);
      else val = raw.indexOf('{{') >= 0 ? interp(raw, scope) : raw;
      var lname = name.toLowerCase();
      if (lname === 'ref') { if (typeof val === 'function') p.ref = val; continue; }
      if (lname.indexOf('on') === 0 && ATTR[lname]) { if (typeof val === 'function') p[ATTR[lname]] = val; continue; }
      if (lname === 'style') { p.style = typeof val === 'string' ? styleObj(val) : val; continue; }
      if (BOOL[lname]) {
        var on = m ? !!val : (raw === '' || raw === lname || raw === 'true');
        p[ATTR[lname] || lname] = on;
        continue;
      }
      if (lname === 'value' && (el.localName === 'input' || el.localName === 'select' || el.localName === 'textarea')) {
        p.value = val == null ? '' : val; continue;
      }
      var target = ATTR[lname] || ((svg && name.indexOf('-') > 0 && name.indexOf('aria-') !== 0 && name.indexOf('data-') !== 0) ? camel(name) : name);
      if (val === undefined || val === null) continue;
      p[target] = val;
    }
    if (p.value !== undefined && !p.onChange && !p.onInput) { p.defaultValue = p.value; delete p.value; }
    if (p.checked !== undefined && !p.onChange) { p.defaultChecked = p.checked; delete p.checked; }
    return p;
  }

  function build(node, scope, key) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      if (t.indexOf('\n') >= 0 && !/\S/.test(t)) return null; /* formatting whitespace */
      return t.indexOf('{{') >= 0 ? interp(t, scope) : t;
    }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === 'sc-if') {
      var cond = node.getAttribute('value') || '';
      var m = cond.match(HOLE_ONLY), v = m ? lookup(m[1], scope) : cond;
      return v ? R.createElement(R.Fragment, { key: key }, kids(node, scope)) : null;
    }
    if (tag === 'sc-for') {
      var lm = (node.getAttribute('list') || '').match(HOLE_ONLY);
      var list = lm ? lookup(lm[1], scope) : null, as = node.getAttribute('as') || 'item';
      if (!list || !list.length) return null;
      return R.createElement(R.Fragment, { key: key }, list.map(function (item, i) {
        var s = Object.create(scope); s[as] = item;
        return R.createElement(R.Fragment, { key: i }, kids(node, s));
      }));
    }
    var c = kids(node.localName === 'template' ? node.content : node, scope);
    var p = props(node, scope, key);
    if (tag === 'textarea') return R.createElement(tag, p);
    return R.createElement.apply(null, [tag, p].concat(c));
  }
  function kids(node, scope) {
    var out = [], ch = node.childNodes;
    for (var i = 0; i < ch.length; i++) {
      var r = build(ch[i], scope, i);
      if (r !== null && r !== '') out.push(r);
    }
    return out;
  }

  var TEMPLATE = null;
  function DCLogic(p) { R.Component.call(this, p); this.state = {}; }
  DCLogic.prototype = Object.create(R.Component.prototype);
  DCLogic.prototype.constructor = DCLogic;
  DCLogic.prototype.renderVals = function () { return {}; };
  DCLogic.prototype.render = function () {
    var vals = this.renderVals() || {};
    return R.createElement(R.Fragment, null, kids(TEMPLATE, vals));
  };
  window.DCLogic = DCLogic;

  function coerce(v, d) {
    if (typeof d === 'boolean') return v === 'true' || v === '1' || v === '';
    if (typeof d === 'number') { var n = parseFloat(v); return isNaN(n) ? d : n; }
    return v;
  }

  window.DCMount = function (Component, defs) {
    var tpl = document.getElementById('dc-template');
    TEMPLATE = tpl.content;
    var initial = {}, q = new URLSearchParams(window.location.search);
    Object.keys(defs || {}).forEach(function (k) {
      var d = defs[k] && defs[k]['default'];
      initial[k] = q.has(k) ? coerce(q.get(k), d) : d;
    });
    var host = document.getElementById('app');
    RD.createRoot(host).render(R.createElement(Component, initial));
  };
})();
