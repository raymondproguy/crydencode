/* Code editor page: three tabs (HTML, CSS, JS), draft saved in localStorage, Run opens the separate preview page. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  var h = CP.h;

  var SAMPLES = [
    { id: 'hello', title: 'Hello page', html: '<h1>Hello, Learner!</h1>\n<p>This is a live preview.</p>', css: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 1rem;\n}\nh1 { color: #6a47f2; }', js: '' },
    { id: 'card', title: 'Profile card (CSS)', html: '<article class="card">\n  <h1>Alex Carter</h1>\n  <p>Web developer in training.</p>\n  <a href="https://developer.mozilla.org/">Favourite docs</a>\n</article>', css: 'body { font-family: system-ui, sans-serif; background: #eef0f9; padding: 1rem; }\n.card {\n  max-width: 22rem;\n  margin: 0 auto;\n  background: white;\n  padding: 1.5rem;\n  border-radius: 1rem;\n  box-shadow: 0 6px 20px rgba(0,0,0,.1);\n}\nh1 { margin-top: 0; font-size: 1.4rem; }', js: '' },
    { id: 'counter', title: 'Click counter (JavaScript)', html: '<button id="btn" type="button">Clicked 0 times</button>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; }\nbutton { min-height: 44px; padding: 0 1.25rem; font-size: 1rem; }', js: 'const button = document.querySelector("#btn");\nlet count = 0;\n\nbutton.addEventListener("click", () => {\n  count++;\n  button.textContent = "Clicked " + count + " times";\n  console.log("count is", count);\n});' },
    { id: 'flex', title: 'Flexbox row', html: '<div class="row">\n  <div class="item">One</div>\n  <div class="item">Two</div>\n  <div class="item">Three</div>\n</div>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; }\n.row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.item {\n  flex: 1 1 8rem;\n  background: #e5ddff;\n  padding: 1rem;\n  border-radius: 8px;\n  text-align: center;\n}', js: '' },
    { id: 'blank', title: 'Blank page', html: '', css: '', js: '' }
  ];

  var TABS = [['html', 'HTML'], ['css', 'CSS'], ['js', 'JS']];

  CP.pages.editor = function (main) {
    var draft = CP.store.getDraft();
    var current = draft && (draft.html || draft.css || draft.js) ? draft : { html: SAMPLES[0].html, css: SAMPLES[0].css, js: SAMPLES[0].js, source: 'Hello page' };
    var active = 'html';
    var areas = {}, tabBtns = {};
    var saved = h('span', { class: 'small muted', role: 'status', 'aria-live': 'polite' });
    var timer = null;

    function values() { return { html: areas.html.value, css: areas.css.value, js: areas.js.value, source: current.source || '' }; }
    function persist() {
      var ok = CP.store.setDraft(values());
      saved.textContent = ok ? 'Draft saved on this device' : 'Could not save the draft (storage is blocked)';
    }
    function schedule() { saved.textContent = 'Saving…'; clearTimeout(timer); timer = setTimeout(persist, 400); }

    var tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Code language' });
    var panels = h('div');
    TABS.forEach(function (t) {
      var btn = h('button', { class: 'tab', role: 'tab', type: 'button', id: 'tab-' + t[0], 'aria-controls': 'panel-' + t[0], text: t[1] });
      btn.addEventListener('click', function () { select(t[0], true); });
      btn.addEventListener('keydown', function (e) {
        var i = TABS.map(function (x) { return x[0]; }).indexOf(t[0]);
        if (e.key === 'ArrowRight') { e.preventDefault(); select(TABS[(i + 1) % TABS.length][0], true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select(TABS[(i + TABS.length - 1) % TABS.length][0], true); }
      });
      tabBtns[t[0]] = btn;
      tabs.appendChild(btn);
      var area = h('textarea', { class: 'code-area', id: 'code-' + t[0], spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', wrap: 'off', 'aria-label': t[1] + ' code' });
      area.value = current[t[0]] || '';
      area.addEventListener('input', schedule);
      areas[t[0]] = area;
      panels.appendChild(h('div', { role: 'tabpanel', id: 'panel-' + t[0], 'aria-labelledby': 'tab-' + t[0] }, area));
    });
    function select(lang, focus) {
      active = lang;
      TABS.forEach(function (t) {
        var on = t[0] === lang;
        tabBtns[t[0]].setAttribute('aria-selected', String(on));
        tabBtns[t[0]].tabIndex = on ? 0 : -1;
        document.getElementById('panel-' + t[0]).hidden = !on;
      });
      if (focus) { tabBtns[lang].focus(); }
    }

    var runBtn = h('button', { class: 'btn', type: 'button' }, CP.icon('play', 18), 'Run');
    var resetBtn = h('button', { class: 'btn btn-secondary', type: 'button', text: 'Reset' });
    var copyBtn = h('button', { class: 'btn btn-secondary', type: 'button' }, CP.icon('copy', 18), 'Copy');
    var dlBtn = h('button', { class: 'btn btn-secondary', type: 'button' }, CP.icon('download', 18), 'Download');

    runBtn.addEventListener('click', function () { clearTimeout(timer); persist(); window.location.href = 'preview.html'; });
    copyBtn.addEventListener('click', function () {
      CP.copyText(areas[active].value).then(function () { CP.toast(TABS.filter(function (t) { return t[0] === active; })[0][1] + ' code copied'); }, function () { CP.toast('Could not copy. Select the text and copy it by hand.'); });
    });
    dlBtn.addEventListener('click', function () {
      var v = values();
      var doc = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My CrydenCode page</title>\n' + (v.css.trim() ? '  <style>\n' + v.css + '\n  </style>\n' : '') + '</head>\n<body>\n' + v.html + '\n' + (v.js.trim() ? '<script>\n' + v.js.replace(/<\/script/gi, '<\\/script') + '\n<\/script>\n' : '') + '</body>\n</html>\n';
      var url = URL.createObjectURL(new Blob([doc], { type: 'text/html' }));
      var a = h('a', { href: url, download: 'my-page.html' });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      CP.toast('Downloaded my-page.html (all three languages in one file)');
    });
    resetBtn.addEventListener('click', function () {
      CP.confirm({ title: 'Reset the editor?', message: 'This replaces all three tabs with the "Hello page" sample. Download or copy your code first if you want to keep it.', confirmLabel: 'Reset' }).then(function (yes) { if (yes) load(SAMPLES[0]); });
    });

    function load(sample) {
      areas.html.value = sample.html; areas.css.value = sample.css; areas.js.value = sample.js;
      current.source = sample.title;
      sourceNote.textContent = 'Editing: ' + sample.title;
      persist();
    }

    var sampleSel = h('select', { id: 'sample-select' }, [h('option', { value: '', text: 'Choose a sample…' })].concat(SAMPLES.map(function (s) { return h('option', { value: s.id, text: s.title }); })));
    sampleSel.addEventListener('change', function () {
      var s = SAMPLES.filter(function (x) { return x.id === sampleSel.value; })[0];
      sampleSel.value = '';
      if (!s) return;
      CP.confirm({ title: 'Load "' + s.title + '"?', message: 'Your current code will be replaced.', confirmLabel: 'Load sample' }).then(function (yes) { if (yes) load(s); });
    });

    var sourceNote = h('p', { class: 'small muted', style: 'margin:0', text: 'Editing: ' + (current.source || 'your code') });

    var help = h('details', { class: 'panel', open: !draft },
      h('summary', { style: 'cursor:pointer;font-weight:600', text: 'How to use the editor' }),
      h('ol', { style: 'margin-top:12px' },
        h('li', { text: 'Type HTML in the HTML tab, styles in CSS, and behaviour in JS.' }),
        h('li', null, 'Press ', h('strong', { text: 'Run' }), '. The result opens on the Preview page, which is separate from the editor.'),
        h('li', { text: 'Use "Back to editor" on the preview to keep editing. Your code is saved automatically.' }),
        h('li', null, 'In JS, ', h('code', { text: 'console.log("hi")' }), ' shows messages in the preview\'s console.')),
      h('p', { class: 'small muted', style: 'margin-bottom:0', text: 'Code runs in a sandbox on the Preview page. It is a learning sandbox, not a production security boundary.' }));

    main.append(
      CP.pageHead('Editor', 'Code editor', 'Write HTML, CSS and JavaScript. Run it to see the result.'),
      h('div', { class: 'stack' },
        help,
        h('div', { class: 'editor-toolbar' },
          h('div', { class: 'btn-row' }, runBtn, resetBtn, copyBtn, dlBtn),
          h('div', { class: 'field', style: 'margin:0' }, h('label', { class: 'visually-hidden', for: 'sample-select', text: 'Load a sample' }), sampleSel),
          sourceNote),
        tabs, panels,
        saved
      )
    );
    select('html', false);
    if (!CP.store.getDraft()) persist();
  };
})();
