/* Live preview page. Learner code only ever runs inside a sandboxed iframe (scripts allowed, no same-origin access). */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  var h = CP.h;
  var MAX_CONSOLE_LINES = 200;
  var MAX_MESSAGE = 2000;

  function jsonForScript(value) { return JSON.stringify(value).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, function (c) { return c === '\u2028' ? '\\u2028' : '\\u2029'; }); }
  function safeScript(code) { return String(code).replace(/<\/(script)/gi, '<\\/$1'); }

  /* Runs first inside the frame: forwards console output and gives learner code a localStorage that works
     in a sandbox without same-origin access (data is kept by the parent page under a separate key). */
  function shim(nonce, initial) {
    return '(function(){var N=' + jsonForScript(nonce) + ';var data=Object.create(null);var init=' + jsonForScript(initial) + ';for(var k in init){data[k]=init[k];}' +
      'function send(t,a){try{parent.postMessage({cpPreview:N,type:t,args:a},"*");}catch(e){}}' +
      'function fmt(v){if(typeof v==="string")return v;try{var s=JSON.stringify(v);return s===undefined?String(v):s;}catch(e){return String(v);}}' +
      '["log","info","warn","error","debug"].forEach(function(m){var o=console[m];console[m]=function(){send(m,[].map.call(arguments,fmt));try{o.apply(console,arguments);}catch(e){}};});' +
      'window.addEventListener("error",function(e){send("error",[e.message+(e.lineno?" (line "+e.lineno+")":"")]);});' +
      'window.addEventListener("unhandledrejection",function(e){send("error",["Unhandled promise rejection: "+fmt(e.reason&&e.reason.message?e.reason.message:e.reason)]);});' +
      'function sync(){send("storage",[JSON.stringify(data)]);}' +
      'var ls={getItem:function(k){k=String(k);return k in data?data[k]:null;},setItem:function(k,v){data[String(k)]=String(v);sync();},removeItem:function(k){delete data[String(k)];sync();},clear:function(){data=Object.create(null);sync();},key:function(i){return Object.keys(data)[i]||null;}};' +
      'Object.defineProperty(ls,"length",{get:function(){return Object.keys(data).length;}});' +
      'try{Object.defineProperty(window,"localStorage",{value:ls,configurable:true});}catch(e){}})();';
  }

  /* Builds one HTML document from the three editor tabs. Handles both fragments and complete documents. */
  function buildDoc(draft, nonce, initial) {
    var shimTag = '<script>' + safeScript(shim(nonce, initial) + CP.LOOP_PRELUDE) + '<\/script>';
    var styleTag = draft.css.trim() ? '<style>\n' + draft.css.replace(/<\/(style)/gi, '<\\/$1') + '\n</style>' : '';
    var scriptTag = draft.js.trim() ? '<script>\n' + safeScript(CP.guardLoops(draft.js)) + '\n<\/script>' : '';
    var html = draft.html;
    var isFull = /<!doctype|<html[\s>]/i.test(html);
    if (!isFull) {
      return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' + shimTag + styleTag + '</head><body>' + html + '\n' + scriptTag + '</body></html>';
    }
    var out = html;
    var headOpen = /<head[^>]*>/i;
    if (headOpen.test(out)) out = out.replace(headOpen, function (m) { return m + shimTag; });
    else if (/<html[^>]*>/i.test(out)) out = out.replace(/<html[^>]*>/i, function (m) { return m + '<head>' + shimTag + '</head>'; });
    else out = shimTag + out;
    if (styleTag) out = /<\/head>/i.test(out) ? out.replace(/<\/head>/i, function () { return styleTag + '</head>'; }) : out + styleTag;
    if (scriptTag) out = /<\/body>/i.test(out) ? out.replace(/<\/body>/i, function () { return scriptTag + '</body>'; }) : out + scriptTag;
    return out;
  }

  CP.pages.preview = function (main) {
    var draft = CP.store.getDraft();
    var toolbar = h('div', { class: 'btn-row', style: 'margin-bottom:12px' });
    main.appendChild(CP.pageHead('Preview', 'Live preview', 'The result of your code from the editor.'));

    if (!draft || !(draft.html.trim() || draft.css.trim() || draft.js.trim())) {
      main.appendChild(CP.emptyState('Nothing to preview yet', 'Write some code in the editor and press Run. It will show up here.', h('a', { class: 'btn', href: 'editor.html' }, CP.icon('code', 18), 'Go to the editor')));
      return;
    }

    var nonce = 'p' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    var frame = null;
    var wrap = h('div', { class: 'preview-frame-wrap' });
    var consoleBox = h('div', { class: 'console', role: 'log', 'aria-live': 'off', tabindex: '0', 'aria-label': 'Console output' });
    var consoleEmpty = h('p', { class: 'small muted', style: 'margin:0', text: 'Console messages from your code appear here.' });
    consoleBox.appendChild(consoleEmpty);
    var width = 'desktop';
    var sizes = { phone: '375px', tablet: '768px', desktop: '100%' };
    var viewBtns = {};

    function addLine(kind, text) {
      if (consoleEmpty.parentNode) consoleEmpty.remove();
      var line = h('div', { class: 'console-line' + (kind === 'error' ? ' error' : kind === 'warn' ? ' warn' : '') }, (kind === 'error' ? 'Error: ' : kind === 'warn' ? 'Warning: ' : '') + String(text).slice(0, MAX_MESSAGE));
      consoleBox.appendChild(line);
      while (consoleBox.children.length > MAX_CONSOLE_LINES) consoleBox.removeChild(consoleBox.firstChild);
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }

    function onMessage(e) {
      if (!frame || e.source !== frame.contentWindow || !e.data || e.data.cpPreview !== nonce) return;
      var args = Array.isArray(e.data.args) ? e.data.args : [];
      if (e.data.type === 'storage') {
        try { if (typeof args[0] === 'string' && args[0].length < 500000) CP.store.setSandboxData(JSON.parse(args[0])); } catch (err) { /* ignore bad data */ }
        return;
      }
      if (['log', 'info', 'warn', 'error', 'debug'].indexOf(e.data.type) === -1) return;
      addLine(e.data.type, args.map(String).join(' '));
    }
    window.addEventListener('message', onMessage);

    function run() {
      draft = CP.store.getDraft() || draft;
      if (frame) frame.remove();
      CP.clear(consoleBox).appendChild(consoleEmpty);
      frame = h('iframe', { class: 'preview-frame', title: 'Preview of your page', sandbox: 'allow-scripts allow-modals allow-forms', referrerpolicy: 'no-referrer' });
      frame.style.width = sizes[width];
      frame.srcdoc = buildDoc(draft, nonce, CP.store.getSandboxData());
      CP.clear(wrap).appendChild(frame);
    }

    function setWidth(w) {
      width = w;
      Object.keys(viewBtns).forEach(function (k) { viewBtns[k].setAttribute('aria-pressed', String(k === w)); });
      if (frame) frame.style.width = sizes[w];
    }

    var runAgain = h('button', { class: 'btn', type: 'button' }, CP.icon('refresh', 18), 'Run again');
    runAgain.addEventListener('click', run);
    var back = h('a', { class: 'btn btn-secondary', href: 'editor.html' }, CP.icon('left', 18), 'Back to editor');
    var views = h('div', { class: 'chip-row', role: 'group', 'aria-label': 'Preview width', style: 'margin-bottom:0;padding-bottom:0' });
    [['phone', 'Phone', 'phone'], ['tablet', 'Tablet', 'tablet'], ['desktop', 'Full width', 'monitor']].forEach(function (v) {
      var b = h('button', { class: 'chip', type: 'button', 'aria-pressed': String(v[0] === width) }, v[1]);
      b.addEventListener('click', function () { setWidth(v[0]); });
      viewBtns[v[0]] = b; views.appendChild(b);
    });
    var clearConsole = h('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Clear console', onclick: function () { CP.clear(consoleBox).appendChild(consoleEmpty); } });
    var clearData = h('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Clear saved preview data', onclick: function () { CP.store.clearSandboxData(); CP.toast('Preview storage cleared'); run(); } });

    toolbar.append(back, runAgain);
    main.append(
      toolbar,
      views,
      h('div', { style: 'margin-top:12px' }, wrap),
      h('section', { class: 'section', 'aria-labelledby': 'console-h' }, h('div', { class: 'section-head' }, h('h2', { id: 'console-h', text: 'Console' }), clearConsole), consoleBox),
      h('div', { class: 'callout', role: 'note' }, h('strong', { text: 'Learning sandbox' }), h('p', null, 'Your code runs in a sandboxed frame without access to CrydenCode\'s own data. It is made for learning and is not a production security boundary, so do not paste passwords or private data. If your code uses localStorage here, that data is kept separately from your progress. ', clearData))
    );
    run();
  };
})();
