/* Pages: progress, settings. Everything shown on Progress is calculated from saved learner data. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  var h = CP.h, calc = CP.calc;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function ring(pct) {
    var size = 120, r = 50, c = 2 * Math.PI * r;
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size); svg.setAttribute('width', size); svg.setAttribute('height', size);
    svg.setAttribute('class', 'ring'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', pct + ' percent of lessons completed');
    function circle(stroke, offset) {
      var el = document.createElementNS(SVG_NS, 'circle');
      el.setAttribute('cx', 60); el.setAttribute('cy', 60); el.setAttribute('r', r); el.setAttribute('fill', 'none');
      el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', 10); el.setAttribute('stroke-linecap', 'round');
      if (offset !== null) { el.setAttribute('stroke-dasharray', c); el.setAttribute('stroke-dashoffset', offset); el.setAttribute('transform', 'rotate(-90 60 60)'); }
      return el;
    }
    svg.appendChild(circle('var(--surface-2)', null));
    svg.appendChild(circle('var(--accent)', c * (1 - pct / 100)));
    var t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', 60); t.setAttribute('y', 66); t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', 'var(--text)');
    t.setAttribute('font-size', 22); t.setAttribute('font-weight', 700); t.textContent = pct + '%';
    svg.appendChild(t);
    return svg;
  }

  CP.pages.progress = function (main) {
    var s = CP.store.get();
    var overall = calc.overall();
    var name = s.profile.name;
    main.appendChild(CP.pageHead('Progress', name ? name + '\'s progress' : 'Your progress', 'Calculated from what you have actually completed on this device.'));

    var tiles = h('div', { class: 'grid-3', style: 'margin-top:12px' },
      h('div', { class: 'stat' }, h('strong', { text: overall.done + '/' + overall.total }), h('span', { text: 'Lessons' })),
      h('div', { class: 'stat' }, h('strong', { text: calc.exercisesDone() + '/' + CP.exercises.length }), h('span', { text: 'Exercises' })),
      h('div', { class: 'stat' }, h('strong', { text: calc.projectsDone() + '/' + CP.projects.length }), h('span', { text: 'Projects' })));
    main.appendChild(h('section', { class: 'panel panel-accent', 'aria-label': 'Overall completion' },
      h('div', { style: 'display:flex;gap:20px;align-items:center;flex-wrap:wrap' }, ring(overall.pct),
        h('div', { style: 'flex:1;min-width:200px' }, h('h2', { text: 'Overall completion' }), h('p', { class: 'muted', style: 'margin:0', text: overall.done + ' of ' + overall.total + ' lessons are complete.' }))),
      tiles));

    // Stages
    var stageSec = h('section', { class: 'section', 'aria-labelledby': 'stages-h' }, h('h2', { id: 'stages-h', text: 'Roadmap stages' }));
    stageSec.appendChild(h('ul', { class: 'rows' }, CP.stages.map(function (st) {
      var p = calc.stageProgress(st.id);
      return h('li', null, h('a', { class: 'row', href: 'roadmap.html#stage-' + st.id },
        h('span', { class: 'stage-num' + (p.status === 'complete' ? ' done' : ''), text: String(st.id) }),
        h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: st.title }), h('span', { class: 'row-meta', text: p.done + ' of ' + p.total + ' lessons' }), CP.progressBar(p.pct, p.status === 'complete', st.title + ' progress')),
        h('span', { class: 'row-end' }, p.status === 'complete' ? h('span', { class: 'badge badge-ok', text: 'Complete' }) : h('span', { class: 'small', text: p.pct + '%' }))));
    })));
    main.appendChild(stageSec);

    // Activity (real saved days only)
    var days = [];
    var d = new Date();
    for (var i = 13; i >= 0; i--) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i); days.push({ key: CP.store.dayKey(x), label: x.toLocaleDateString(undefined, { weekday: 'narrow' }), n: s.activity[CP.store.dayKey(x)] || 0 }); }
    var max = Math.max.apply(null, days.map(function (x) { return x.n; }).concat([1]));
    var totalDays = Object.keys(s.activity).length;
    var act = h('section', { class: 'section', 'aria-labelledby': 'act-h' }, h('h2', { id: 'act-h', text: 'Study activity' }));
    if (!totalDays) {
      act.appendChild(h('p', { class: 'muted', text: 'No study days yet. Open a lesson to start your streak.' }));
    } else {
      act.appendChild(h('p', { class: 'muted', text: totalDays + (totalDays === 1 ? ' day' : ' days') + ' studied in total · current streak ' + calc.streak() + (calc.streak() === 1 ? ' day' : ' days') }));
      act.appendChild(h('div', { class: 'bars', role: 'img', 'aria-label': 'Activity over the last 14 days: ' + days.filter(function (x) { return x.n > 0; }).length + ' days with study' },
        days.map(function (x) { return h('div', { class: 'bar' + (x.n ? ' on' : ''), style: 'height:' + (x.n ? Math.max(10, Math.round((x.n / max) * 100)) : 3) + '%', title: x.key + ': ' + x.n + ' actions' }); })));
      act.appendChild(h('div', { class: 'bar-labels', 'aria-hidden': 'true' }, days.map(function (x) { return h('span', { text: x.label }); })));
    }
    main.appendChild(act);

    // Quizzes
    var qsec = h('section', { class: 'section', 'aria-labelledby': 'quiz-h' }, h('div', { class: 'section-head' }, h('h2', { id: 'quiz-h', text: 'Quiz scores' }), h('a', { href: 'quiz.html', text: 'Take a quiz' })));
    qsec.appendChild(h('ul', { class: 'rows' }, CP.quizzes.map(function (qz) {
      var rec = s.progress.quizzes[qz.id];
      var last = rec && rec.attempts.length ? rec.attempts[rec.attempts.length - 1] : null;
      return h('li', null, h('div', { class: 'row' },
        h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: qz.title }), h('span', { class: 'row-meta', text: last ? 'Last: ' + last.score + '/' + last.total + ' on ' + CP.fmtDate(last.at) + ' · ' + rec.attempts.length + (rec.attempts.length === 1 ? ' attempt' : ' attempts') : 'Not taken yet' })),
        h('span', { class: 'row-end' }, rec && last ? h('span', { class: 'badge badge-ok', text: 'Best ' + rec.best + '/' + rec.total }) : h('span', { class: 'badge', text: '—' }))));
    })));
    main.appendChild(qsec);

    // Projects
    var psec = h('section', { class: 'section', 'aria-labelledby': 'proj-h' }, h('div', { class: 'section-head' }, h('h2', { id: 'proj-h', text: 'Project milestones' }), h('a', { href: 'projects.html', text: 'All projects' })));
    psec.appendChild(h('ul', { class: 'rows' }, CP.projects.map(function (p) {
      var st = calc.projectState(p.id);
      return h('li', null, h('a', { class: 'row', href: 'projects.html#' + p.id },
        h('span', { class: 'status-icon' + (st.status === 'complete' ? ' done' : st.status === 'in-progress' ? ' current' : ''), 'aria-hidden': 'true' }, CP.icon('check', 14)),
        h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: p.title }), h('span', { class: 'row-meta', text: st.checked + ' of ' + st.total + ' checklist items' })),
        h('span', { class: 'row-end' }, st.status === 'complete' ? h('span', { class: 'badge badge-ok', text: 'Done' }) : st.status === 'in-progress' ? h('span', { class: 'badge badge-accent', text: 'In progress' }) : h('span', { class: 'badge', text: 'Not started' }))));
    })));
    main.appendChild(psec);

    // Completed lessons
    var doneLessons = CP.lessons.filter(function (l) { return calc.isDone(l.id); });
    var lsec = h('section', { class: 'section', 'aria-labelledby': 'done-h' }, h('h2', { id: 'done-h', text: 'Completed lessons' }));
    if (doneLessons.length) lsec.appendChild(h('ul', { class: 'rows' }, doneLessons.map(function (l) { return CP.lessonRow(l, { showStage: true }); })));
    else lsec.appendChild(CP.emptyState('No lessons completed yet', 'Finish a lesson and press Mark complete. It will appear here.', h('a', { class: 'btn', href: 'modules.html', text: 'Browse lessons' })));
    main.appendChild(lsec);

    // Next step
    var next = calc.nextLesson();
    var msg = overall.done === 0 ? 'Start with the first lesson. Fifteen minutes is enough.' : overall.pct === 100 ? 'You finished every lesson. Build the portfolio project next.' : 'Keep going. Your next lesson is waiting.';
    main.appendChild(h('section', { class: 'section panel', 'aria-labelledby': 'next-h' }, h('h2', { id: 'next-h', text: 'Your next step' }), h('p', { text: msg }),
      next ? h('a', { class: 'btn', href: 'lesson.html?id=' + encodeURIComponent(next.id) }, next.title, CP.icon('right', 18)) : h('a', { class: 'btn', href: 'projects.html', text: 'Go to projects' })));
  };

  /* ---------------- Settings ---------------- */
  CP.pages.settings = function (main) {
    var s = CP.store.get();
    main.appendChild(CP.pageHead('Settings', 'Settings', 'Your profile, appearance, backups and offline use.'));

    // Profile
    var nameInput = h('input', { type: 'text', id: 'set-name', maxlength: '40', autocomplete: 'nickname', value: s.profile.name });
    var color = s.profile.color;
    var swatches = h('div', { class: 'swatches', role: 'group', 'aria-label': 'Avatar colour' });
    var HEX = { violet: '#7c5cff', blue: '#2f7de1', teal: '#139a8e', pink: '#d1458f', amber: '#b97a12' };
    CP.store.COLORS.forEach(function (c) {
      var b = h('button', { type: 'button', class: 'swatch', style: 'background:' + HEX[c], 'aria-label': c, 'aria-pressed': String(c === color) });
      b.addEventListener('click', function () { color = c; swatches.querySelectorAll('.swatch').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
      swatches.appendChild(b);
    });
    var saveProfile = h('button', { class: 'btn', type: 'button', text: 'Save profile' });
    saveProfile.addEventListener('click', function () {
      CP.store.update(function (st) { st.profile.name = nameInput.value.trim().slice(0, 40); st.profile.color = color; st.profile.onboarded = true; });
      CP.toast('Profile saved');
      setTimeout(function () { location.reload(); }, 600);
    });
    main.appendChild(h('section', { class: 'panel', 'aria-labelledby': 'prof-h' },
      h('h2', { id: 'prof-h', text: 'Learner profile' }),
      h('div', { style: 'display:flex;align-items:center;gap:12px;margin-bottom:12px' }, CP.avatar('lg'), h('p', { class: 'muted small', style: 'margin:0', text: 'This profile lives only in this browser. There is no account, no password and no server.' })),
      h('div', { class: 'field' }, h('label', { for: 'set-name', text: 'Display name' }), nameInput),
      h('div', { class: 'field' }, h('span', { class: 'hint', text: 'Avatar colour' }), swatches),
      saveProfile));

    // Appearance
    var themeSel = h('select', { id: 'set-theme' }, [['dark', 'Dark'], ['light', 'Light'], ['system', 'Match my device']].map(function (o) { return h('option', { value: o[0], text: o[1], selected: s.settings.theme === o[0] }); }));
    var fontSel = h('select', { id: 'set-font' }, [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']].map(function (o) { return h('option', { value: o[0], text: o[1], selected: s.settings.fontSize === o[0] }); }));
    function saveAppearance() {
      CP.store.update(function (st) { st.settings.theme = themeSel.value; st.settings.fontSize = fontSel.value; });
      CP.applySettings();
    }
    themeSel.addEventListener('change', saveAppearance);
    fontSel.addEventListener('change', saveAppearance);
    main.appendChild(h('section', { class: 'section panel', 'aria-labelledby': 'app-h' },
      h('h2', { id: 'app-h', text: 'Appearance' }),
      h('div', { class: 'field' }, h('label', { for: 'set-theme', text: 'Theme' }), themeSel),
      h('div', { class: 'field' }, h('label', { for: 'set-font', text: 'Reading size' }), fontSel)));

    // Data
    var dataMsg = h('p', { role: 'status', 'aria-live': 'polite', class: 'small' });
    var fileInput = h('input', { type: 'file', id: 'import-file', accept: 'application/json,.json' });
    var exportBtn = h('button', { class: 'btn', type: 'button' }, CP.icon('download', 18), 'Export my data (JSON)');
    var resetBtn = h('button', { class: 'btn btn-danger', type: 'button' }, CP.icon('trash', 18), 'Reset all progress');
    exportBtn.addEventListener('click', function () {
      var blob = new Blob([CP.store.exportData()], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = h('a', { href: url, download: 'crydencode-progress-' + CP.store.dayKey() + '.json' });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      dataMsg.textContent = 'Exported. Keep the file somewhere safe.';
    });
    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (file.size > 5000000) { dataMsg.textContent = 'That file is too large to be a CrydenCode export.'; return; }
      var reader = new FileReader();
      reader.onload = function () {
        var res = CP.store.parseImport(String(reader.result));
        if (!res.ok) { dataMsg.textContent = 'Import failed: ' + res.error; fileInput.value = ''; return; }
        var st = res.state;
        var summary = Object.keys(st.progress.lessons).length + ' lessons, ' + Object.keys(st.progress.exercises).length + ' exercises, ' + Object.keys(st.progress.quizzes).length + ' quizzes and ' + st.bookmarks.length + ' bookmarks';
        CP.confirm({ title: 'Replace your progress?', message: 'This file contains ' + summary + (st.profile.name ? ' for ' + st.profile.name : '') + '. Importing replaces what is saved in this browser now.', confirmLabel: 'Import' }).then(function (yes) {
          if (!yes) { dataMsg.textContent = 'Import cancelled. Nothing was changed.'; fileInput.value = ''; return; }
          CP.store.applyImport(res);
          dataMsg.textContent = 'Import complete.';
          setTimeout(function () { location.reload(); }, 600);
        });
      };
      reader.onerror = function () { dataMsg.textContent = 'The file could not be read.'; };
      reader.readAsText(file);
    });
    resetBtn.addEventListener('click', function () {
      CP.confirm({ title: 'Reset all progress?', message: 'This deletes your profile, completed lessons, quiz scores, projects, bookmarks and saved editor code from this browser. Export first if you might want it back. This cannot be undone.', confirmLabel: 'Delete everything', danger: true, requireText: 'RESET' }).then(function (yes) {
        if (!yes) return;
        CP.store.reset();
        location.href = 'index.html';
      });
    });
    main.appendChild(h('section', { class: 'section panel', 'aria-labelledby': 'data-h' },
      h('h2', { id: 'data-h', text: 'Your data' }),
      h('p', { class: 'muted small', text: 'Progress is saved in this browser on this device. Clearing browser data, using a private window or switching browsers can remove it. Export a backup now and then, and import it on another device to move your progress.' }),
      h('div', { class: 'btn-row' }, exportBtn),
      h('div', { class: 'field', style: 'margin-top:16px' }, h('label', { for: 'import-file', text: 'Import a previous export' }), fileInput, h('span', { class: 'hint', text: 'The file is checked before anything changes.' })),
      dataMsg,
      h('hr'),
      h('h3', { text: 'Danger zone' }), resetBtn));

    // Offline
    var offText = h('p'), offDetail = h('p', { class: 'small muted' });
    function paintOff() { offText.textContent = 'Status: ' + (CP.offline.state.code === 'unknown' ? 'Checking…' : CP.offline.state.text); offDetail.textContent = CP.offline.state.detail; }
    CP.offline.subscribe(paintOff); paintOff();
    var zipMsg = h('p', { class: 'small', role: 'status', 'aria-live': 'polite' });
    var zipBtn = h('button', { class: 'btn btn-secondary', type: 'button' }, CP.icon('download', 18), 'Download website ZIP');
    zipBtn.addEventListener('click', function () {
      zipBtn.disabled = true; zipMsg.textContent = 'Building ZIP…';
      CP.offline.downloadZip().then(function (r) { zipMsg.textContent = 'Done: ' + r.files + ' files.'; }, function (e) { zipMsg.textContent = 'ZIP failed: ' + (e && e.message ? e.message : 'unknown error') + '. Open the site from a web address and try again.'; }).then(function () { zipBtn.disabled = false; });
    });
    main.appendChild(h('section', { class: 'section panel', 'aria-labelledby': 'off-h' },
      h('h2', { id: 'off-h', text: 'Offline and installing' }),
      offText, offDetail,
      h('ul', { class: 'small' },
        h('li', null, h('strong', { text: 'Installing' }), ' saves the site in your browser so it opens like an app without internet. It needs HTTPS or localhost.'),
        h('li', null, h('strong', { text: 'The ZIP' }), ' is a copy of the website files to keep or publish yourself. It does not contain your progress.'),
        h('li', null, 'On iPhone or iPad: open the Share menu in Safari and choose Add to Home Screen.')),
      h('div', { class: 'btn-row' }, zipBtn), zipMsg));

    // About
    main.appendChild(h('section', { class: 'section panel', 'aria-labelledby': 'about-h' },
      h('h2', { id: 'about-h', text: 'About CrydenCode' }),
      h('p', { text: 'CrydenCode is a personal learning platform for HTML, CSS and JavaScript, built with plain HTML, CSS and JavaScript. Version ' + (window.CP_FILES ? CP_FILES.version : '1') + '. Content last reviewed ' + CP.LAST_REVIEWED + '.' }),
      h('p', { class: 'small muted', text: 'The code editor preview is a learning sandbox, not a production security boundary. Do not paste secrets into it.' }),
      h('p', null, h('a', { href: 'resources.html', text: 'Sources and further reading' }), ' · ', h('a', { href: 'LICENSE', text: 'Licence' }))));
  };
})();
