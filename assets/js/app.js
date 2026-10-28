/* CrydenCode app shell: DOM helpers, icons, navigation, dialogs, progress maths, page boot. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  CP.pages = CP.pages || {};

  /* ---------- DOM helper (never uses innerHTML with data) ---------- */
  function append(el, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(el, c); }); return; }
    if (child instanceof Node) { el.appendChild(child); return; }
    el.appendChild(document.createTextNode(String(child)));
  }
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  CP.h = h;
  CP.clear = function (el) { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  /* `code` in backticks becomes <code>. Everything else stays plain text. */
  CP.text = function (s) {
    var frag = document.createDocumentFragment();
    String(s).split('`').forEach(function (part, i) {
      if (!part) return;
      frag.appendChild(i % 2 ? h('code', { text: part }) : document.createTextNode(part));
    });
    return frag;
  };

  /* ---------- Icons (simple inline SVG, stroke style) ---------- */
  var ICONS = {
    home: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
    map: ['M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z', 'M8 2v16', 'M16 6v16'],
    book: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
    code: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
    target: ['c:12,12,10', 'c:12,12,6', 'c:12,12,2'],
    help: ['c:12,12,10', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01'],
    briefcase: ['r:2,7,20,14,2', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
    chart: ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
    bookmark: ['M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'],
    settings: ['M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M1 14h6', 'M9 8h6', 'M17 16h6'],
    more: ['c:5,12,1', 'c:12,12,1', 'c:19,12,1'],
    download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
    upload: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
    check: ['M20 6L9 17l-5-5'],
    lock: ['r:3,11,18,11,2', 'M7 11V7a5 5 0 0 1 10 0v4'],
    clock: ['c:12,12,10', 'M12 6v6l4 2'],
    right: ['M5 12h14', 'M12 5l7 7-7 7'],
    left: ['M19 12H5', 'M12 19l-7-7 7-7'],
    chevron: ['M9 18l6-6-6-6'],
    play: ['M5 3l14 9-14 9z'],
    copy: ['r:9,9,13,13,2', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
    refresh: ['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10', 'M1 14l4.64 4.36A9 9 0 0 0 20.49 15'],
    external: ['M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6', 'M15 3h6v6', 'M10 14L21 3'],
    search: ['c:11,11,8', 'M21 21l-4.35-4.35'],
    x: ['M18 6L6 18', 'M6 6l12 12'],
    info: ['c:12,12,10', 'M12 16v-4', 'M12 8h.01'],
    phone: ['r:6,2,12,20,2', 'M12 18h.01'],
    tablet: ['r:4,2,16,20,2', 'M12 18h.01'],
    monitor: ['r:2,3,20,14,2', 'M8 21h8', 'M12 17v4'],
    trash: ['M3 6h18', 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6', 'M10 11v6', 'M14 11v6', 'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
    star: ['M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z'],
    flame: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z']
  };
  var SVG_NS = 'http://www.w3.org/2000/svg';
  CP.icon = function (name, size) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size || 20);
    svg.setAttribute('height', size || 20);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    (ICONS[name] || []).forEach(function (spec) {
      var el;
      if (spec.indexOf('c:') === 0) {
        var c = spec.slice(2).split(',');
        el = document.createElementNS(SVG_NS, 'circle');
        el.setAttribute('cx', c[0]); el.setAttribute('cy', c[1]); el.setAttribute('r', c[2]);
      } else if (spec.indexOf('r:') === 0) {
        var r = spec.slice(2).split(',');
        el = document.createElementNS(SVG_NS, 'rect');
        el.setAttribute('x', r[0]); el.setAttribute('y', r[1]); el.setAttribute('width', r[2]); el.setAttribute('height', r[3]); el.setAttribute('rx', r[4]);
      } else {
        el = document.createElementNS(SVG_NS, 'path');
        el.setAttribute('d', spec);
      }
      svg.appendChild(el);
    });
    return svg;
  };

  /* ---------- Syntax highlighting for read-only code (DOM nodes, no innerHTML) ---------- */
  var JS_KEYWORDS = 'const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|new|class|extends|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|in|of|true|false|null|undefined|this';
  var RULES = {
    js: new RegExp('(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|(\'(?:\\\\.|[^\'\\\\\\n])*\'|"(?:\\\\.|[^"\\\\\\n])*"|`(?:\\\\.|[^`\\\\])*`)|(\\b\\d+(?:\\.\\d+)?\\b)|\\b(' + JS_KEYWORDS + ')\\b|(\\b[A-Za-z_$][\\w$]*(?=\\())', 'g'),
    css: /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|vh|vw|%|s|ms|fr|deg)?\b)|(@[\w-]+)|([\w-]+(?=\s*:[^;{}]*[;}]))|([.#][A-Za-z_][\w-]*)/g
  };
  var CLASSES = {
    js: [null, 'tok-com', 'tok-str', 'tok-num', 'tok-kw', 'tok-fn'],
    css: [null, 'tok-com', 'tok-str', 'tok-num', 'tok-kw', 'tok-attr', 'tok-fn']
  };

  function highlightRegex(code, lang) {
    var frag = document.createDocumentFragment();
    var re = new RegExp(RULES[lang].source, 'g');
    var last = 0, m;
    while ((m = re.exec(code)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(code.slice(last, m.index)));
      var cls = null;
      for (var i = 1; i < m.length; i++) { if (m[i] !== undefined) { cls = CLASSES[lang][i]; break; } }
      frag.appendChild(h('span', { class: cls, text: m[0] }));
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (last < code.length) frag.appendChild(document.createTextNode(code.slice(last)));
    return frag;
  }

  function highlightHtml(code) {
    var frag = document.createDocumentFragment();
    var chunks = code.match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+|</g) || [];
    chunks.forEach(function (chunk) {
      if (chunk.indexOf('<!--') === 0) { frag.appendChild(h('span', { class: 'tok-com', text: chunk })); return; }
      if (chunk.charAt(0) !== '<' || chunk.length < 2) { frag.appendChild(document.createTextNode(chunk)); return; }
      var re = /(<!?\/?[A-Za-z][\w-]*)|(\/?>)|([A-Za-z_:@][\w:.-]*)(?=\s*=)|("[^"]*"|'[^']*')/g;
      var last = 0, m;
      while ((m = re.exec(chunk)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(chunk.slice(last, m.index)));
        var cls = m[1] || m[2] ? 'tok-tag' : m[3] ? 'tok-attr' : 'tok-str';
        frag.appendChild(h('span', { class: cls, text: m[0] }));
        last = m.index + m[0].length;
      }
      if (last < chunk.length) frag.appendChild(document.createTextNode(chunk.slice(last)));
    });
    return frag;
  }

  CP.highlight = function (code, lang) {
    if (lang === 'html') return highlightHtml(code);
    if (lang === 'css' || lang === 'js') return highlightRegex(code, lang);
    return document.createTextNode(code);
  };

  /* ---------- Loop guard ----------
     A sandboxed iframe still shares the page's thread, so `while (true) {}` would freeze the whole tab.
     guardLoops() inserts a cheap call at the start of every for/while/do block with braces. __cpLoop throws
     once one loop has run continuously for a long time. It is a safety net for beginners, not a security boundary. */
  CP.LOOP_PRELUDE = '(function(){var m={};window.__cpLoop=function(id){var n=Date.now(),e=m[id];if(!e||n-e.last>300){e=m[id]={c:0,t:n,last:n};}e.last=n;if(++e.c>5000&&n-e.t>1500){delete m[id];throw new Error("Your loop ran for a long time and was stopped. Check that its condition can become false.");}};})();';

  CP.guardLoops = function (code) {
    code = String(code);
    var out = '', i = 0, n = code.length, id = 0;
    function skipString(from, quote) {
      var q = from + 1;
      while (q < n && code.charAt(q) !== quote) { if (code.charAt(q) === '\\') q++; q++; }
      return q;
    }
    function skipSpace(from) { while (from < n && /\s/.test(code.charAt(from))) from++; return from; }
    while (i < n) {
      var c = code.charAt(i), d = code.charAt(i + 1);
      if (c === '/' && d === '/') { var e1 = code.indexOf('\n', i); e1 = e1 === -1 ? n : e1; out += code.slice(i, e1); i = e1; continue; }
      if (c === '/' && d === '*') { var e2 = code.indexOf('*/', i + 2); e2 = e2 === -1 ? n : e2 + 2; out += code.slice(i, e2); i = e2; continue; }
      if (c === '"' || c === "'" || c === '`') { var j = skipString(i, c); out += code.slice(i, j + 1); i = j + 1; continue; }
      if (/[A-Za-z_$]/.test(c) && (i === 0 || (!/[\w$.]/.test(code.charAt(i - 1))))) {
        var word = /^[A-Za-z_$][\w$]*/.exec(code.slice(i, i + 40))[0];
        if (word === 'for' || word === 'while') {
          var k = skipSpace(i + word.length);
          if (code.charAt(k) === '(') {
            var depth = 0, p = k;
            for (; p < n; p++) {
              var ch = code.charAt(p);
              if (ch === '"' || ch === "'" || ch === '`') { p = skipString(p, ch); continue; }
              if (ch === '(') depth++;
              else if (ch === ')') { depth--; if (depth === 0) break; }
            }
            var after = skipSpace(p + 1);
            if (code.charAt(after) === '{') { out += code.slice(i, after + 1) + '__cpLoop(' + (++id) + ');'; i = after + 1; continue; }
          }
        } else if (word === 'do') {
          var k2 = skipSpace(i + 2);
          if (code.charAt(k2) === '{') { out += code.slice(i, k2 + 1) + '__cpLoop(' + (++id) + ');'; i = k2 + 1; continue; }
        }
        out += word; i += word.length; continue;
      }
      out += c; i++;
    }
    return out;
  };

  CP.copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = h('textarea', { 'aria-hidden': 'true', style: 'position:fixed;opacity:0;top:0;left:0' });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  };

  var LANG_LABEL = { html: 'HTML', css: 'CSS', js: 'JavaScript', text: 'Text', sh: 'Terminal' };
  CP.codeBlock = function (code, lang, title) {
    var copyBtn = h('button', {
      class: 'btn btn-ghost btn-sm', type: 'button', 'aria-label': 'Copy this code',
      onclick: function () {
        CP.copyText(code).then(function () { CP.toast('Code copied'); }, function () { CP.toast('Could not copy. Select the text and copy it manually.'); });
      }
    }, CP.icon('copy', 16), 'Copy');
    return h('div', { class: 'code-block' },
      h('div', { class: 'code-head' }, h('span', { text: title || LANG_LABEL[lang] || lang }), copyBtn),
      h('pre', { class: 'code', tabindex: '0' }, h('code', null, CP.highlight(code, lang)))
    );
  };

  /* ---------- Toast & dialogs ---------- */
  var toastHost = null;
  CP.toast = function (message, action) {
    if (!toastHost) {
      toastHost = h('div', { class: 'toast-host', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(toastHost);
    }
    var t = h('div', { class: 'toast' }, h('span', { text: message }));
    if (action) t.appendChild(h('button', { type: 'button', text: action.label, onclick: function () { action.run(); t.remove(); } }));
    toastHost.appendChild(t);
    setTimeout(function () { t.remove(); }, action ? 9000 : 3200);
  };

  /* Resolves true/false. `requireText` makes the learner type a word before the confirm button works. */
  CP.confirm = function (opts) {
    return new Promise(function (resolve) {
      if (typeof HTMLDialogElement === 'undefined') { resolve(window.confirm(opts.message)); return; }
      var input = null;
      var confirmBtn = h('button', { class: 'btn ' + (opts.danger ? 'btn-danger' : ''), type: 'button', text: opts.confirmLabel || 'Confirm' });
      var cancelBtn = h('button', { class: 'btn btn-secondary', type: 'button', text: 'Cancel' });
      var body = [h('h2', { text: opts.title }), h('p', { class: 'muted', text: opts.message })];
      if (opts.requireText) {
        input = h('input', { type: 'text', id: 'confirm-input', autocomplete: 'off', autocapitalize: 'characters', 'aria-label': 'Type ' + opts.requireText + ' to confirm' });
        body.push(h('div', { class: 'field' }, h('label', { for: 'confirm-input', text: 'Type ' + opts.requireText + ' to confirm' }), input));
        confirmBtn.disabled = true;
        input.addEventListener('input', function () { confirmBtn.disabled = input.value.trim().toUpperCase() !== opts.requireText; });
      }
      var dlg = h('dialog', { 'aria-labelledby': 'confirm-title' }, body, h('div', { class: 'btn-row' }, confirmBtn, cancelBtn));
      dlg.querySelector('h2').id = 'confirm-title';
      function done(v) { dlg.close(); dlg.remove(); resolve(v); }
      confirmBtn.addEventListener('click', function () { done(true); });
      cancelBtn.addEventListener('click', function () { done(false); });
      dlg.addEventListener('cancel', function (e) { e.preventDefault(); done(false); });
      document.body.appendChild(dlg);
      dlg.showModal();
      (input || cancelBtn).focus();
    });
  };

  /* ---------- Formatting ---------- */
  CP.fmtDate = function (ts) {
    if (!ts) return '';
    try { return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; }
  };
  CP.fmtMinutes = function (m) {
    if (m < 60) return m + ' min';
    var hrs = Math.floor(m / 60), rest = m % 60;
    return hrs + ' h' + (rest ? ' ' + rest + ' min' : '');
  };
  CP.TRACKS = { basics: 'Basics', html: 'HTML', css: 'CSS', js: 'JavaScript', tools: 'Developer tools', projects: 'Projects' };
  CP.TRACK_TILE = { basics: 'WWW', html: 'HTML', css: 'CSS', js: 'JS', tools: 'DEV', projects: 'PRJ' };

  /* ---------- Progress maths (always derived from saved data) ---------- */
  var calc = (CP.calc = {});
  calc.lesson = function (id) { return (CP.lessons || []).filter(function (l) { return l.id === id; })[0] || null; };
  calc.lessonIndex = function (id) { return (CP.lessons || []).map(function (l) { return l.id; }).indexOf(id); };
  calc.stageLessons = function (n) { return (CP.lessons || []).filter(function (l) { return l.stage === n; }); };
  calc.isDone = function (id) { return !!CP.store.get().progress.lessons[id]; };
  calc.stageProgress = function (n) {
    var list = calc.stageLessons(n);
    var done = list.filter(function (l) { return calc.isDone(l.id); }).length;
    var status = done === 0 ? 'not-started' : done === list.length ? 'complete' : 'in-progress';
    return { done: done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0, status: status };
  };
  calc.overall = function () {
    var total = (CP.lessons || []).length;
    var done = (CP.lessons || []).filter(function (l) { return calc.isDone(l.id); }).length;
    return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0 };
  };
  calc.currentStage = function () {
    var stages = CP.stages || [];
    for (var i = 0; i < stages.length; i++) { if (calc.stageProgress(stages[i].id).status !== 'complete') return stages[i]; }
    return null;
  };
  calc.nextLesson = function () {
    var s = CP.store.get();
    if (s.lastLesson && calc.lesson(s.lastLesson) && !calc.isDone(s.lastLesson)) return calc.lesson(s.lastLesson);
    var list = CP.lessons || [];
    for (var i = 0; i < list.length; i++) { if (!calc.isDone(list[i].id)) return list[i]; }
    return null;
  };
  calc.exercisesDone = function () {
    var s = CP.store.get();
    return (CP.exercises || []).filter(function (e) { return s.progress.exercises[e.id]; }).length;
  };
  calc.projectState = function (id) {
    var proj = (CP.projects || []).filter(function (p) { return p.id === id; })[0];
    var saved = CP.store.get().progress.projects[id];
    var total = proj ? proj.checklist.length : 0;
    var checked = 0;
    if (saved) for (var i = 0; i < total; i++) { if (saved.checks[i]) checked++; }
    return { checked: checked, total: total, status: checked === 0 ? 'not-started' : checked === total ? 'complete' : 'in-progress' };
  };
  calc.projectsDone = function () {
    return (CP.projects || []).filter(function (p) { return calc.projectState(p.id).status === 'complete'; }).length;
  };
  calc.streak = function () {
    var act = CP.store.get().activity;
    var d = new Date();
    if (!act[CP.store.dayKey(d)]) d.setDate(d.getDate() - 1); // today may not have activity yet
    var n = 0;
    while (act[CP.store.dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  calc.greeting = function () {
    var hr = new Date().getHours();
    var part = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    var name = CP.store.get().profile.name;
    return name ? part + ', ' + name : part;
  };

  CP.lessonCompleteToggle = function (id) {
    var wasDone = calc.isDone(id);
    CP.store.update(function (s) {
      if (wasDone) delete s.progress.lessons[id];
      else s.progress.lessons[id] = { done: true, at: Date.now() };
    });
    if (!wasDone) CP.store.logActivity();
    return !wasDone;
  };
  CP.isBookmarked = function (type, id) {
    return CP.store.get().bookmarks.some(function (b) { return b.type === type && b.id === id; });
  };
  CP.toggleBookmark = function (type, id) {
    var now = CP.isBookmarked(type, id);
    CP.store.update(function (s) {
      if (now) s.bookmarks = s.bookmarks.filter(function (b) { return !(b.type === type && b.id === id); });
      else s.bookmarks.unshift({ type: type, id: id, at: Date.now() });
    });
    return !now;
  };

  /* Shared UI pieces */
  CP.progressBar = function (pct, ok, label) {
    var bar = h('div', { class: 'progress' + (ok ? ' ok' : ''), role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': label || 'Progress' }, h('span'));
    requestAnimationFrame(function () { bar.firstChild.style.width = pct + '%'; });
    return bar;
  };
  CP.emptyState = function (title, text, action) {
    return h('div', { class: 'empty' }, CP.emptyArt(), h('h3', { text: title }), h('p', { text: text }), action || null);
  };
  CP.emptyArt = function () {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 120 90'); svg.setAttribute('class', 'art'); svg.setAttribute('aria-hidden', 'true');
    var parts = [
      ['rect', { x: 14, y: 14, width: 92, height: 62, rx: 10, fill: 'none', stroke: 'var(--border)', 'stroke-width': 2 }],
      ['circle', { cx: 28, cy: 27, r: 3, fill: 'var(--accent)' }],
      ['circle', { cx: 38, cy: 27, r: 3, fill: 'var(--border)' }],
      ['path', { d: 'M44 48l-8 8 8 8M76 48l8 8-8 8M64 44l-8 24', fill: 'none', stroke: 'var(--accent)', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }]
    ];
    parts.forEach(function (p) {
      var el = document.createElementNS(SVG_NS, p[0]);
      Object.keys(p[1]).forEach(function (k) { el.setAttribute(k, p[1][k]); });
      svg.appendChild(el);
    });
    return svg;
  };
  CP.lessonRow = function (lesson, opts) {
    opts = opts || {};
    var done = calc.isDone(lesson.id);
    return h('li', null,
      h('a', { class: 'row', href: 'lesson.html?id=' + encodeURIComponent(lesson.id) },
        h('span', { class: 'track-tile', 'data-track': lesson.track, text: CP.TRACK_TILE[lesson.track] }),
        h('span', { class: 'row-main' },
          h('span', { class: 'row-title', text: lesson.title }),
          h('span', { class: 'row-meta' },
            h('span', { class: 'badge', text: lesson.level }),
            h('span', null, '~' + lesson.minutes + ' min'),
            opts.showStage ? h('span', null, 'Stage ' + lesson.stage) : null
          )
        ),
        h('span', { class: 'row-end' },
          done ? h('span', { class: 'badge badge-ok' }, CP.icon('check', 12), 'Done') : null,
          CP.icon('chevron', 18)
        )
      )
    );
  };

  /* ---------- Shell: top bar, side nav, bottom nav ---------- */
  var NAV = [
    { href: 'index.html', label: 'Home', icon: 'home', pages: ['home'] },
    { href: 'roadmap.html', label: 'Roadmap', icon: 'map', pages: ['roadmap'] },
    { href: 'modules.html', label: 'Lessons', icon: 'book', pages: ['modules', 'lesson'] },
    { href: 'editor.html', label: 'Code editor', icon: 'code', pages: ['editor', 'preview'] },
    { href: 'practice.html', label: 'Practice', icon: 'target', pages: ['practice'] },
    { href: 'quiz.html', label: 'Quizzes', icon: 'help', pages: ['quiz'] },
    { href: 'projects.html', label: 'Projects', icon: 'briefcase', pages: ['projects'] },
    { href: 'progress.html', label: 'Progress', icon: 'chart', pages: ['progress'] },
    { href: 'bookmarks.html', label: 'Bookmarks', icon: 'bookmark', pages: ['bookmarks'] },
    { href: 'resources.html', label: 'Resources', icon: 'external', pages: ['resources', 'offline'] },
    { href: 'settings.html', label: 'Settings', icon: 'settings', pages: ['settings'] }
  ];
  var BOTTOM = ['index.html', 'roadmap.html', 'projects.html', 'progress.html'];

  function navLink(item, page) {
    var current = item.pages.indexOf(page) !== -1;
    return h('a', { href: item.href, 'aria-current': current ? 'page' : null }, CP.icon(item.icon, 20), h('span', { text: item.label }));
  }

  function avatar(size) {
    var p = CP.store.get().profile;
    var initial = (p.name || 'C').trim().charAt(0).toUpperCase();
    return h('a', { class: 'avatar' + (size === 'lg' ? ' avatar-lg' : ''), href: 'settings.html', 'data-color': p.color, 'aria-label': (p.name || 'Learner') + ' — profile and settings' }, initial);
  }
  CP.avatar = avatar;

  function statusLabel() {
    var o = CP.offline ? CP.offline.state : null;
    var online = navigator.onLine !== false;
    if (!online) return { text: 'Offline', online: false, ready: o && o.code === 'ready' };
    if (o && o.code === 'ready') return { text: 'Offline-ready', online: true, ready: true };
    if (o && o.code === 'preparing') return { text: 'Preparing offline files…', online: true, ready: false };
    return { text: 'Online', online: true, ready: false };
  }
  CP.statusLabel = statusLabel;

  function renderShell(page) {
    var top = document.getElementById('topbar');
    var side = document.getElementById('sidebar');
    var bottom = document.getElementById('bottom-nav');
    var chip = h('span', { class: 'status-chip', id: 'status-chip' }, h('span', { class: 'status-dot' }), h('span', { class: 'status-text' }));
    if (top) {
      top.appendChild(h('a', { class: 'brand', href: 'index.html' }, h('span', { class: 'brand-mark' }, CP.icon('code', 16)), 'CrydenCode'));
      top.appendChild(h('div', { class: 'topbar-right' }, chip, avatar()));
    }
    if (side) {
      side.appendChild(h('a', { class: 'brand', href: 'index.html' }, h('span', { class: 'brand-mark' }, CP.icon('code', 16)), 'CrydenCode'));
      side.appendChild(h('nav', { class: 'side-nav', 'aria-label': 'Main' }, NAV.map(function (item) { return navLink(item, page); })));
      side.appendChild(h('p', { class: 'side-foot' }, 'Your progress is saved in this browser only.'));
    }
    if (bottom) {
      var main = BOTTOM.map(function (href) { return NAV.filter(function (n) { return n.href === href; })[0]; });
      main.forEach(function (item) { bottom.appendChild(navLink(item, page)); });
      var inMore = !main.some(function (n) { return n.pages.indexOf(page) !== -1; });
      var moreBtn = h('button', { type: 'button', 'aria-haspopup': 'dialog', 'aria-current': inMore ? 'page' : null }, CP.icon('more', 20), h('span', { text: 'More' }));
      moreBtn.addEventListener('click', function () { openMore(page); });
      bottom.appendChild(moreBtn);
    }
    updateStatus();
    if (CP.offline) CP.offline.subscribe(updateStatus);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
  }

  function updateStatus() {
    var chip = document.getElementById('status-chip');
    if (!chip) return;
    var s = statusLabel();
    chip.setAttribute('data-online', String(s.online));
    chip.setAttribute('data-state', s.ready ? 'ready' : 'idle');
    chip.querySelector('.status-text').textContent = s.text;
  }

  function openMore(page) {
    if (typeof HTMLDialogElement === 'undefined') { location.href = 'settings.html'; return; }
    var more = NAV.filter(function (n) { return BOTTOM.indexOf(n.href) === -1; });
    var closeBtn = h('button', { class: 'btn btn-secondary btn-block', type: 'button', text: 'Close' });
    var dlg = h('dialog', { 'aria-label': 'More pages' },
      h('h2', { text: 'More' }),
      h('nav', { class: 'more-links', 'aria-label': 'More pages' }, more.map(function (item) {
        var a = navLink(item, page);
        return a;
      })),
      closeBtn
    );
    function close() { dlg.close(); dlg.remove(); }
    closeBtn.addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('close', function () { dlg.remove(); });
    document.body.appendChild(dlg);
    dlg.showModal();
  }

  /* ---------- Settings application ---------- */
  CP.applySettings = function () {
    var s = CP.store.get().settings;
    var theme = s.theme;
    if (theme === 'system') theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    if (s.fontSize === 'medium') document.documentElement.removeAttribute('data-font');
    else document.documentElement.setAttribute('data-font', s.fontSize);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f6fb' : '#0a0f1f');
  };

  /* ---------- First-run welcome (local profile, no account) ---------- */
  function welcome() {
    if (typeof HTMLDialogElement === 'undefined') return;
    var color = 'violet';
    var nameInput = h('input', { type: 'text', id: 'welcome-name', maxlength: '40', autocomplete: 'nickname', placeholder: 'e.g. Ada' });
    var swatchRow = h('div', { class: 'swatches', role: 'group', 'aria-label': 'Choose a colour' });
    var COLORS = { violet: '#7c5cff', blue: '#2f7de1', teal: '#139a8e', pink: '#d1458f', amber: '#b97a12' };
    CP.store.COLORS.forEach(function (c) {
      var b = h('button', { type: 'button', class: 'swatch', style: 'background:' + COLORS[c], 'aria-label': c, 'aria-pressed': String(c === color) });
      b.addEventListener('click', function () {
        color = c;
        swatchRow.querySelectorAll('.swatch').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
      swatchRow.appendChild(b);
    });
    var start = h('button', { class: 'btn btn-block', type: 'button', text: 'Start learning' });
    var skip = h('button', { class: 'btn btn-ghost btn-block', type: 'button', text: 'Skip for now' });
    var dlg = h('dialog', { 'aria-labelledby': 'welcome-title' },
      h('p', { class: 'eyebrow', text: 'Welcome to CrydenCode' }),
      h('h2', { id: 'welcome-title', text: 'Learn to code, one small step at a time' }),
      h('p', { class: 'muted' }, 'HTML, CSS and JavaScript lessons, a code editor, practice and projects. It works offline once your files are saved.'),
      h('div', { class: 'field' }, h('label', { for: 'welcome-name', text: 'What should we call you?' }), nameInput),
      h('div', { class: 'field' }, h('span', { class: 'hint', text: 'Pick a colour for your avatar' }), swatchRow),
      h('p', { class: 'hint' }, 'There are no accounts or passwords. Your name and progress stay in this browser on this device. Clearing browser data can erase them, so use Settings → Export to keep a backup.'),
      start, skip
    );
    function finish(withName) {
      CP.store.update(function (s) {
        s.profile.name = withName ? nameInput.value.trim().slice(0, 40) : '';
        s.profile.color = color;
        s.profile.onboarded = true;
        s.profile.createdAt = Date.now();
      });
      dlg.close(); dlg.remove();
      location.reload();
    }
    start.addEventListener('click', function () { finish(true); });
    skip.addEventListener('click', function () { finish(false); });
    nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') finish(true); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); });
    document.body.appendChild(dlg);
    dlg.showModal();
  }

  /* ---------- Boot ---------- */
  var PAGES_WITHOUT_WELCOME = ['offline', 'preview'];

  function boot() {
    var page = document.body.getAttribute('data-page') || 'home';
    CP.applySettings();
    renderShell(page);
    var main = document.getElementById('main');
    if (main) main.classList.add('page-enter');
    var render = CP.pages[page];
    if (render && main) {
      try { render(main); } catch (e) {
        if (window.console) console.error(e);
        CP.clear(main).appendChild(CP.emptyState('Something went wrong', 'This page could not load. Try reloading it. Your saved progress has not been changed.', h('a', { class: 'btn', href: 'index.html', text: 'Go home' })));
      }
    }
    if (!CP.store.isAvailable()) {
      CP.toast('Saving is switched off in this browser, so progress will not be kept.');
    }
    if (!CP.store.get().profile.onboarded && PAGES_WITHOUT_WELCOME.indexOf(page) === -1) welcome();
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').addEventListener && window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if (CP.store.get().settings.theme === 'system') CP.applySettings();
    });
  }

  // Deferred scripts run while readyState is "interactive" and before DOMContentLoaded, so wait for that event
  // to be sure every page script has registered itself in CP.pages.
  if (document.readyState === 'complete') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
