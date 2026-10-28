/* Pages: home, roadmap, modules, lesson, bookmarks, resources. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  var h = CP.h, calc = CP.calc;

  function pageHead(eyebrow, title, desc) {
    return h('header', { class: 'page-head' }, eyebrow ? h('p', { class: 'eyebrow', text: eyebrow }) : null, h('h1', { text: title }), desc ? h('p', { text: desc }) : null);
  }
  CP.pageHead = pageHead;

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50); }
  CP.resources.forEach(function (g) { g.items.forEach(function (it) { it.id = slug(it.title); }); });
  function resourceById(id) {
    var found = null;
    CP.resources.forEach(function (g) { g.items.forEach(function (it) { if (it.id === id) found = it; }); });
    return found;
  }

  function bookmarkButton(type, id, label) {
    var btn = h('button', { class: 'btn btn-secondary btn-sm', type: 'button' });
    function paint() {
      var on = CP.isBookmarked(type, id);
      CP.clear(btn).append(CP.icon('bookmark', 16), on ? 'Saved' : 'Bookmark');
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', (on ? 'Remove bookmark: ' : 'Bookmark: ') + label);
    }
    btn.addEventListener('click', function () {
      var on = CP.toggleBookmark(type, id);
      paint();
      CP.toast(on ? 'Bookmarked' : 'Bookmark removed');
    });
    paint();
    return btn;
  }

  /* Opens the editor with code already loaded. */
  function openInEditor(files, source) {
    CP.store.setDraft({ html: files.html || '', css: files.css || '', js: files.js || '', source: source });
    window.location.href = 'editor.html';
  }
  CP.openInEditor = openInEditor;

  /* ---------------- Home ---------------- */
  CP.pages.home = function (main) {
    var s = CP.store.get();
    var overall = calc.overall();
    var next = calc.nextLesson();
    var stage = calc.currentStage();

    var continueCard;
    if (next) {
      var started = s.progress.lessons && Object.keys(s.progress.lessons).length > 0;
      continueCard = h('section', { class: 'panel panel-accent', 'aria-labelledby': 'continue-h' },
        h('p', { class: 'eyebrow', text: started ? 'Continue learning' : 'Start here' }),
        h('h2', { id: 'continue-h', text: next.title }),
        h('p', { class: 'muted', text: 'Stage ' + next.stage + ' · ' + CP.TRACKS[next.track] + ' · about ' + next.minutes + ' min' }),
        h('a', { class: 'btn', href: 'lesson.html?id=' + encodeURIComponent(next.id) }, started ? 'Continue lesson' : 'Start first lesson', CP.icon('right', 18))
      );
    } else {
      continueCard = h('section', { class: 'panel panel-accent' }, h('p', { class: 'eyebrow', text: 'All lessons complete' }), h('h2', { text: 'You finished every lesson' }), h('p', { class: 'muted', text: 'Build the projects, retake quizzes and keep practising.' }), h('a', { class: 'btn', href: 'projects.html', text: 'Go to projects' }));
    }

    var hero = h('section', { class: 'hero', 'aria-labelledby': 'hello' },
      h('div', null,
        h('p', { class: 'eyebrow', text: 'CrydenCode' }),
        h('h1', { id: 'hello', text: CP.calc.greeting() + '!' }),
        h('p', { class: 'muted', text: s.profile.onboarded && overall.done > 0 ? 'Good work so far. A little every day adds up.' : 'Learn HTML, CSS and JavaScript step by step. Your progress is saved on this device.' })
      ),
      h('img', { src: 'assets/images/hero.svg', alt: 'A laptop showing code with a colourful path leading to a flag.', width: '360', height: '270' })
    );

    var stats = h('div', { class: 'grid-3', role: 'list', 'aria-label': 'Your totals' },
      h('div', { class: 'stat', role: 'listitem' }, h('strong', { text: overall.done + '/' + overall.total }), h('span', { text: 'Lessons' })),
      h('div', { class: 'stat', role: 'listitem' }, h('strong', { text: String(calc.exercisesDone()) }), h('span', { text: 'Exercises' })),
      h('div', { class: 'stat', role: 'listitem' }, h('strong', { text: String(calc.projectsDone()) }), h('span', { text: 'Projects' }))
    );

    var progressPanel = h('section', { class: 'panel', 'aria-labelledby': 'overall-h' },
      h('div', { class: 'section-head' }, h('h2', { id: 'overall-h', text: 'Overall progress' }), h('strong', { text: overall.pct + '%' })),
      CP.progressBar(overall.pct, false, 'Overall lesson progress'),
      h('p', { class: 'small muted', style: 'margin:8px 0 0', text: overall.done + ' of ' + overall.total + ' lessons completed' + (stage ? '. Current stage: ' + stage.title + '.' : '.') })
    );

    var recentIds = s.recent.filter(function (id) { return calc.lesson(id); });
    var recentSection = h('section', { class: 'section', 'aria-labelledby': 'recent-h' }, h('div', { class: 'section-head' }, h('h2', { id: 'recent-h', text: 'Recent lessons' }), h('a', { href: 'modules.html', text: 'All lessons' })));
    if (recentIds.length) {
      recentSection.appendChild(h('ul', { class: 'rows' }, recentIds.slice(0, 4).map(function (id) { return CP.lessonRow(calc.lesson(id), { showStage: true }); })));
    } else {
      recentSection.appendChild(CP.emptyState('Nothing opened yet', 'Lessons you open will show up here so you can jump back in.'));
    }

    var upcoming = CP.stages.filter(function (st) { return calc.stageProgress(st.id).status !== 'complete'; }).slice(0, 3);
    var milestones = h('section', { class: 'section', 'aria-labelledby': 'mile-h' }, h('div', { class: 'section-head' }, h('h2', { id: 'mile-h', text: 'Upcoming milestones' }), h('a', { href: 'roadmap.html', text: 'Full roadmap' })));
    if (upcoming.length) {
      milestones.appendChild(h('ul', { class: 'rows' }, upcoming.map(function (st) {
        var p = calc.stageProgress(st.id);
        return h('li', null, h('a', { class: 'row', href: 'roadmap.html#stage-' + st.id },
          h('span', { class: 'stage-num', text: String(st.id) }),
          h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: st.title }), h('span', { class: 'row-meta', text: p.done + ' of ' + p.total + ' lessons · about ' + st.hours + ' h (estimate)' })),
          h('span', { class: 'row-end' }, CP.icon('chevron', 18))));
      })));
    } else {
      milestones.appendChild(h('p', { class: 'muted', text: 'Every stage is complete. Well done!' }));
    }

    var quick = h('section', { class: 'section', 'aria-labelledby': 'quick-h' }, h('h2', { id: 'quick-h', text: 'Quick links' }),
      h('div', { class: 'chip-row', style: 'flex-wrap:wrap' }, [
        ['modules.html', 'Lessons'], ['practice.html', 'Practice'], ['quiz.html', 'Quizzes'], ['projects.html', 'Projects'], ['editor.html', 'Code editor'], ['progress.html', 'Progress']
      ].map(function (l) { return h('a', { class: 'chip', style: 'display:inline-flex;align-items:center;text-decoration:none', href: l[0], text: l[1] }); })));

    main.append(hero, h('div', { class: 'stack' }, continueCard, stats, progressPanel), recentSection, milestones, quick, buildOfflinePanel());
  };

  function buildOfflinePanel() {
    var off = CP.offline;
    var chipText = h('strong');
    var detail = h('p', { class: 'small muted', style: 'margin:4px 0 0' });
    var dl = h('button', { class: 'btn', type: 'button' }, CP.icon('download', 18), 'Download for offline use (ZIP)');
    var install = h('button', { class: 'btn btn-secondary', type: 'button' }, CP.icon('phone', 18), 'Install as an app');
    var msg = h('p', { class: 'small', role: 'status', 'aria-live': 'polite' });

    function paint() {
      var st = CP.statusLabel();
      chipText.textContent = off.state.code === 'ready' ? 'Offline-ready' : off.state.code === 'preparing' ? 'Preparing offline files…' : off.state.code === 'unsupported' ? off.state.text : off.state.code === 'error' ? off.state.text : (st.online ? 'Online' : 'Offline');
      detail.textContent = off.state.detail || (st.online ? '' : 'You are offline now. Saved pages still work.');
      install.hidden = off.isStandalone() || !off.canInstall();
    }
    off.subscribe(paint);
    paint();

    dl.addEventListener('click', function () {
      dl.disabled = true;
      msg.textContent = 'Building ZIP…';
      off.downloadZip(function (done, total) { msg.textContent = 'Adding files ' + done + ' of ' + total + '…'; }).then(function (r) {
        msg.textContent = 'Done. crydencode-website.zip has ' + r.files + ' files (' + Math.round(r.bytes / 1024) + ' KB). Check your downloads folder.';
      }, function (e) {
        msg.textContent = 'The ZIP could not be built (' + (e && e.message ? e.message : 'unknown error') + '). Open CrydenCode from a web address, not directly from a file, and try again.';
      }).then(function () { dl.disabled = false; });
    });
    install.addEventListener('click', function () {
      off.promptInstall().then(function (outcome) { msg.textContent = outcome === 'accepted' ? 'Installing…' : 'Install was not completed.'; paint(); });
    });

    return h('section', { class: 'section panel', 'aria-labelledby': 'offline-h' },
      h('h2', { id: 'offline-h', text: 'Use CrydenCode offline' }),
      h('p', { class: 'small muted', style: 'margin:0 0 4px' }, 'Status'),
      chipText, detail,
      h('div', { class: 'btn-row', style: 'margin-top:12px' }, dl, install),
      msg,
      h('details', { class: 'section' },
        h('summary', { text: 'ZIP or install? What is the difference?' }),
        h('p', { style: 'margin-top:8px' }, 'Installing puts CrydenCode on your home screen or desktop like an app, and saves the files in the browser so it works offline. The ZIP is a copy of all the website\'s source files that you can keep, move to another computer, edit, or publish yourself. Installing needs HTTPS or localhost; the ZIP works anywhere the page can load.'),
        h('p', { class: 'small muted', text: 'Your learning progress is stored in the browser, not in the ZIP. Use Settings → Export to move your progress.' }))
    );
  }

  /* ---------------- Roadmap ---------------- */
  CP.pages.roadmap = function (main) {
    main.appendChild(pageHead('Roadmap', 'Your learning roadmap', 'Six stages from how the web works to building real projects. Times are estimates for a complete beginner.'));
    var current = calc.currentStage();
    var next = calc.nextLesson();
    if (next) {
      main.appendChild(h('a', { class: 'btn', href: 'lesson.html?id=' + encodeURIComponent(next.id), style: 'margin-bottom:16px' }, 'Resume: ' + next.title, CP.icon('right', 18)));
    }
    var hash = (location.hash.match(/stage-(\d+)/) || [])[1];
    var list = h('div', { class: 'stack' });
    CP.stages.forEach(function (st) {
      var p = calc.stageProgress(st.id);
      var lessons = calc.stageLessons(st.id);
      var open = hash ? Number(hash) === st.id : current && current.id === st.id;
      var badge = p.status === 'complete' ? h('span', { class: 'badge badge-ok' }, CP.icon('check', 12), 'Complete') : p.status === 'in-progress' ? h('span', { class: 'badge badge-accent', text: 'In progress' }) : h('span', { class: 'badge', text: 'Not started' });
      var firstTodo = lessons.filter(function (l) { return !calc.isDone(l.id); })[0];
      var det = h('details', { class: 'acc', id: 'stage-' + st.id, open: open },
        h('summary', null,
          h('span', { class: 'stage-num' + (p.status === 'complete' ? ' done' : ''), text: String(st.id) }),
          h('span', { class: 'row-main' },
            h('span', { class: 'row-title', text: st.title }),
            h('span', { class: 'row-meta' }, badge, h('span', { text: p.done + '/' + p.total + ' lessons' }), h('span', { text: '~' + st.hours + ' h (estimate)' }))
          ),
          h('span', { class: 'chev' }, CP.icon('chevron', 18))
        ),
        h('div', { class: 'acc-body' },
          h('p', { text: st.description }),
          CP.progressBar(p.pct, p.status === 'complete', 'Progress in ' + st.title),
          h('h3', { style: 'margin-top:16px', text: 'Prerequisites' }), h('ul', null, st.prerequisites.map(function (t) { return h('li', { text: t }); })),
          h('h3', { text: 'You will learn to' }), h('ul', null, st.objectives.map(function (t) { return h('li', { text: t }); })),
          h('p', { class: 'small muted', text: st.level }),
          h('h3', { text: 'Lessons (' + lessons.length + ')' }),
          h('ul', { class: 'rows' }, lessons.map(function (l) { return CP.lessonRow(l); })),
          st.id === 6 ? h('p', { style: 'margin-top:12px' }, h('a', { class: 'btn btn-secondary', href: 'projects.html', text: 'See the seven projects' })) : null,
          firstTodo ? h('p', { style: 'margin-top:12px' }, h('a', { class: 'btn', href: 'lesson.html?id=' + encodeURIComponent(firstTodo.id), text: p.done ? 'Continue this stage' : 'Start this stage' })) : null
        )
      );
      list.appendChild(det);
    });
    main.appendChild(list);

    main.appendChild(h('section', { class: 'section' },
      h('h2', { text: 'Optional next steps' }),
      h('p', { class: 'muted', text: 'Only after the basics feel comfortable:' }),
      h('ul', null, CP.optionalNext.map(function (n) { return h('li', null, h('strong', { text: n.title + '. ' }), n.text); }))
    ));
    main.appendChild(h('p', { class: 'small muted' }, 'Roadmap informed by the MDN Curriculum and web.dev Learn. Last reviewed ' + CP.LAST_REVIEWED + '. ', h('a', { href: 'resources.html', text: 'See sources' }), '.'));
    if (hash) setTimeout(function () { var el = document.getElementById('stage-' + hash); if (el) el.scrollIntoView(); }, 50);
  };

  /* ---------------- Modules (lesson catalogue) ---------------- */
  CP.pages.modules = function (main) {
    main.appendChild(pageHead('Lessons', 'All lessons', 'Search or filter. Open any lesson, in any order, though the roadmap order is recommended.'));
    var filters = [['all', 'All'], ['basics', 'Basics'], ['html', 'HTML'], ['css', 'CSS'], ['js', 'JavaScript'], ['tools', 'Developer tools'], ['projects', 'Projects']];
    var params = new URLSearchParams(location.search);
    var track = filters.some(function (f) { return f[0] === params.get('track'); }) ? params.get('track') : 'all';
    var status = 'all';
    var query = '';

    var search = h('input', { type: 'search', id: 'lesson-search', placeholder: 'Search lessons', autocomplete: 'off' });
    var chips = h('div', { class: 'chip-row', role: 'group', 'aria-label': 'Filter by topic' });
    var statusSel = h('select', { id: 'status-filter', 'aria-label': 'Filter by status' }, [['all', 'Any status'], ['todo', 'Not done'], ['done', 'Completed']].map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
    var count = h('p', { class: 'small muted', role: 'status', 'aria-live': 'polite' });
    var results = h('div');

    filters.forEach(function (f) {
      var b = h('button', { class: 'chip', type: 'button', 'aria-pressed': String(f[0] === track), text: f[1], 'data-f': f[0] });
      b.addEventListener('click', function () { track = f[0]; chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); }); paint(); });
      chips.appendChild(b);
    });
    search.addEventListener('input', function () { query = search.value.trim().toLowerCase(); paint(); });
    statusSel.addEventListener('change', function () { status = statusSel.value; paint(); });

    function paint() {
      var list = CP.lessons.filter(function (l) {
        if (track !== 'all' && l.track !== track) return false;
        if (status === 'done' && !calc.isDone(l.id)) return false;
        if (status === 'todo' && calc.isDone(l.id)) return false;
        if (query && (l.title + ' ' + l.level + ' ' + CP.TRACKS[l.track] + ' ' + l.objectives.join(' ')).toLowerCase().indexOf(query) === -1) return false;
        return true;
      });
      var projs = (track === 'projects') ? CP.projects.filter(function (p) { return status === 'all' && (!query || (p.title + ' ' + p.summary).toLowerCase().indexOf(query) !== -1); }) : [];
      count.textContent = list.length + (list.length === 1 ? ' lesson' : ' lessons') + (projs.length ? ' and ' + projs.length + ' projects' : '') + ' shown';
      CP.clear(results);
      if (!list.length && !projs.length) {
        results.appendChild(CP.emptyState('No lessons found', 'Try a different word or clear the filters.', h('button', { class: 'btn btn-secondary', type: 'button', text: 'Clear filters', onclick: function () { search.value = ''; query = ''; track = 'all'; status = 'all'; statusSel.value = 'all'; chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-f') === 'all')); }); paint(); } })));
        return;
      }
      if (list.length) results.appendChild(h('ul', { class: 'rows' }, list.map(function (l) { return CP.lessonRow(l, { showStage: true }); })));
      if (projs.length) {
        results.appendChild(h('h2', { style: 'margin-top:24px', text: 'Projects' }));
        results.appendChild(h('ul', { class: 'rows' }, projs.map(function (p) {
          var st = calc.projectState(p.id);
          return h('li', null, h('a', { class: 'row', href: 'projects.html#' + p.id },
            h('span', { class: 'track-tile', 'data-track': 'projects', text: 'PRJ' }),
            h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: p.title }), h('span', { class: 'row-meta' }, h('span', { class: 'badge', text: p.level }), h('span', null, '~' + CP.fmtMinutes(p.minutes)), h('span', null, st.checked + '/' + st.total + ' checks'))),
            h('span', { class: 'row-end' }, st.status === 'complete' ? h('span', { class: 'badge badge-ok', text: 'Done' }) : null, CP.icon('chevron', 18))));
        })));
      }
    }
    main.append(
      h('div', { class: 'field search-wrap' }, h('label', { class: 'visually-hidden', for: 'lesson-search', text: 'Search lessons' }), CP.icon('search', 18), search),
      chips,
      h('div', { class: 'field', style: 'margin-top:8px' }, h('label', { class: 'visually-hidden', for: 'status-filter', text: 'Status' }), statusSel),
      count, results
    );
    paint();
  };

  /* ---------------- Lesson detail ---------------- */
  var NOTE_LABEL = { tip: 'Tip', a11y: 'Accessibility', security: 'Security' };

  CP.pages.lesson = function (main) {
    var id = new URLSearchParams(location.search).get('id');
    var lesson = id ? calc.lesson(id) : null;
    if (!lesson) {
      main.appendChild(CP.emptyState('Lesson not found', 'That lesson link does not match any lesson.', h('a', { class: 'btn', href: 'modules.html', text: 'Browse all lessons' })));
      return;
    }
    document.title = lesson.title + ' | CrydenCode';
    CP.store.update(function (s) {
      s.lastLesson = lesson.id;
      s.recent = [lesson.id].concat(s.recent.filter(function (r) { return r !== lesson.id; })).slice(0, 8);
    });
    CP.store.logActivity();

    var idx = calc.lessonIndex(lesson.id);
    var prev = CP.lessons[idx - 1], nextL = CP.lessons[idx + 1];

    var doneBtn = h('button', { class: 'btn', type: 'button' });
    function paintDone() {
      var done = calc.isDone(lesson.id);
      CP.clear(doneBtn).append(CP.icon('check', 18), done ? 'Completed' : 'Mark complete');
      doneBtn.classList.toggle('is-done', done);
      doneBtn.setAttribute('aria-pressed', String(done));
    }
    doneBtn.addEventListener('click', function () {
      var now = CP.lessonCompleteToggle(lesson.id);
      paintDone();
      CP.toast(now ? 'Lesson complete. Nice work!' : 'Marked as not complete');
    });
    paintDone();

    var body = h('article', { class: 'lesson-body' });
    body.appendChild(h('p', { class: 'eyebrow', text: 'Stage ' + lesson.stage + ' · ' + CP.TRACKS[lesson.track] }));
    body.appendChild(h('h1', { text: lesson.title }));
    body.appendChild(h('p', { class: 'row-meta' }, h('span', { class: 'badge', text: lesson.level }), h('span', null, CP.icon('clock', 14), ' ~' + lesson.minutes + ' min (estimate)')));
    body.appendChild(h('div', { class: 'btn-row', style: 'margin:16px 0' }, doneBtn, bookmarkButton('lesson', lesson.id, lesson.title)));

    body.appendChild(h('h2', { text: 'What you will learn' }));
    body.appendChild(h('ul', null, lesson.objectives.map(function (o) { return h('li', { text: o }); })));

    body.appendChild(h('h2', { text: 'Explanation' }));
    lesson.explain.forEach(function (p) { body.appendChild(h('p', null, CP.text(p))); });
    if (lesson.figure) body.appendChild(h('figure', { style: 'margin:16px 0' }, h('img', { src: lesson.figure.src, alt: lesson.figure.alt, width: '640', height: '280', style: 'height:auto;border-radius:14px' })));

    body.appendChild(h('h2', { text: 'Syntax' }));
    body.appendChild(CP.codeBlock(lesson.syntax.code, lesson.syntax.lang));

    body.appendChild(h('h2', { text: 'Example' }));
    body.appendChild(CP.codeBlock(lesson.example.code, lesson.example.lang));
    body.appendChild(h('div', { class: 'output-box' }, h('strong', { text: 'Expected result: ' }), lesson.example.output));
    var ex = lesson.example;
    if (ex.lang === 'html' || ex.lang === 'css' || ex.lang === 'js') {
      body.appendChild(h('p', { style: 'margin-top:12px' }, h('button', { class: 'btn btn-secondary', type: 'button', onclick: function () {
        var files = ex.lang === 'html' ? { html: ex.code } : ex.lang === 'css' ? { html: lesson.exercise.starter.html || '<p>Style me</p>', css: ex.code } : { html: lesson.exercise.starter.html || '<p>Open the console below the preview.</p>', js: ex.code };
        openInEditor(files, lesson.title + ' (example)');
      } }, CP.icon('code', 18), 'Try this in the editor')));
    }

    body.appendChild(h('h2', { text: 'Common mistakes' }));
    body.appendChild(h('ul', null, lesson.mistakes.map(function (m) { return h('li', { text: m }); })));

    if (lesson.note) body.appendChild(h('div', { class: 'callout ' + lesson.note.type, role: 'note' }, h('strong', { text: NOTE_LABEL[lesson.note.type] || 'Note' }), h('p', null, CP.text(lesson.note.text))));

    var related = CP.exercises.filter(function (e) { return e.lesson === lesson.id; });
    var exBox = h('section', { class: 'panel', style: 'margin-top:24px', 'aria-labelledby': 'ex-h' },
      h('h2', { id: 'ex-h', style: 'margin-top:0', text: 'Small exercise' }),
      h('p', { text: lesson.exercise.task }),
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn', type: 'button', onclick: function () { openInEditor(lesson.exercise.starter, lesson.title + ' (exercise)'); } }, CP.icon('code', 18), 'Open starter code'),
        related.length ? h('a', { class: 'btn btn-secondary', href: 'practice.html#' + related[0].id, text: 'Checked practice' }) : null
      )
    );
    body.appendChild(exBox);

    body.appendChild(h('h2', { text: 'Read more' }));
    body.appendChild(h('ul', null, lesson.docs.map(function (d) {
      return h('li', null, h('a', { href: d.url, target: '_blank', rel: 'noopener noreferrer' }, d.label, ' ', CP.icon('external', 14)), h('span', { class: 'small muted', text: ' (opens in a new tab, needs internet)' }));
    })));

    var nav = h('nav', { class: 'lesson-nav', 'aria-label': 'Lesson navigation' },
      prev ? h('a', { href: 'lesson.html?id=' + encodeURIComponent(prev.id), class: 'prev' }, h('small', { text: '← Previous' }), prev.title) : h('span'),
      nextL ? h('a', { href: 'lesson.html?id=' + encodeURIComponent(nextL.id), class: 'next' }, h('small', { text: 'Next →' }), nextL.title) : h('a', { href: 'projects.html', class: 'next' }, h('small', { text: 'Finished the lessons' }), 'Build a project')
    );
    main.append(body, nav);
  };

  /* ---------------- Bookmarks ---------------- */
  CP.pages.bookmarks = function (main) {
    main.appendChild(pageHead('Saved', 'Bookmarks', 'Quick access to lessons and links you saved.'));
    var tab = 'lesson';
    var tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Bookmark type' });
    var panel = h('div', { role: 'tabpanel', style: 'margin-top:16px', tabindex: '0' });
    var btns = {};
    [['lesson', 'Lessons'], ['resource', 'Resources']].forEach(function (t) {
      var b = h('button', { class: 'tab', role: 'tab', type: 'button', text: t[1], 'aria-selected': String(t[0] === tab) });
      b.addEventListener('click', function () { tab = t[0]; Object.keys(btns).forEach(function (k) { btns[k].setAttribute('aria-selected', String(k === tab)); }); paint(); });
      btns[t[0]] = b; tabs.appendChild(b);
    });
    function paint() {
      var items = CP.store.get().bookmarks.filter(function (b) { return b.type === tab; });
      CP.clear(panel);
      if (!items.length) {
        panel.appendChild(tab === 'lesson'
          ? CP.emptyState('No saved lessons', 'Open a lesson and press Bookmark to keep it here.', h('a', { class: 'btn', href: 'modules.html', text: 'Browse lessons' }))
          : CP.emptyState('No saved resources', 'Bookmark useful links on the Resources page.', h('a', { class: 'btn', href: 'resources.html', text: 'Open resources' })));
        return;
      }
      var ul = h('ul', { class: 'rows' });
      items.forEach(function (b) {
        var title, href, meta, ext = false;
        if (b.type === 'lesson') { var l = calc.lesson(b.id); if (!l) return; title = l.title; href = 'lesson.html?id=' + encodeURIComponent(l.id); meta = CP.TRACKS[l.track] + ' · ' + l.level; }
        else { var r = resourceById(b.id); if (!r) return; title = r.title; href = r.url; meta = r.note; ext = true; }
        var remove = h('button', { class: 'btn btn-ghost btn-sm', type: 'button', 'aria-label': 'Remove bookmark: ' + title }, CP.icon('trash', 16), 'Remove');
        remove.addEventListener('click', function () {
          CP.toggleBookmark(b.type, b.id);
          CP.toast('Bookmark removed', { label: 'Undo', run: function () { CP.toggleBookmark(b.type, b.id); paint(); } });
          paint();
        });
        ul.appendChild(h('li', null, h('div', { class: 'row' },
          h('a', ext ? { class: 'row-main', href: href, target: '_blank', rel: 'noopener noreferrer', style: 'text-decoration:none;color:inherit' } : { class: 'row-main', href: href, style: 'text-decoration:none;color:inherit' },
            h('span', { class: 'row-title', text: title }), h('span', { class: 'row-meta', text: meta })),
          h('span', { class: 'row-end' }, remove))));
      });
      panel.appendChild(ul);
    }
    main.append(tabs, panel);
    paint();
  };

  /* ---------------- Resources & sources ---------------- */
  CP.pages.resources = function (main) {
    main.appendChild(pageHead('Resources', 'Resources and sources', 'Where this roadmap comes from, and where to read more. Last reviewed ' + CP.LAST_REVIEWED + '.'));

    main.appendChild(h('section', { class: 'panel', 'aria-labelledby': 'what-offline' },
      h('h2', { id: 'what-offline', text: 'What works offline?' }),
      h('ul', null,
        h('li', { text: 'Lessons, exercises, quizzes, projects, the editor, preview and your progress work offline once the status shows "Offline-ready".' }),
        h('li', { text: 'Links below open other websites, so they need internet.' }),
        h('li', { text: 'The Weather dashboard project needs internet and a working public API.' })),
      h('p', { class: 'small muted', text: 'Everything you write is stored in this browser. Use Settings → Export to keep a backup.' })
    ));

    CP.resources.forEach(function (g) {
      var sec = h('section', { class: 'section', 'aria-label': g.group }, h('h2', { text: g.group }));
      sec.appendChild(h('ul', { class: 'rows' }, g.items.map(function (it) {
        return h('li', null, h('div', { class: 'row' },
          h('div', { class: 'row-main' },
            h('a', { class: 'row-title', href: it.url, target: '_blank', rel: 'noopener noreferrer' }, it.title, ' ', CP.icon('external', 14)),
            h('span', { class: 'row-meta', text: it.note })),
          h('span', { class: 'row-end' }, bookmarkButton('resource', it.id, it.title))));
      })));
      main.appendChild(sec);
    });

    main.appendChild(h('section', { class: 'section grid-2' },
      h('div', { class: 'panel' }, h('h2', { text: 'Stable fundamentals' }), h('ul', null, CP.stableVsChanging.stable.map(function (t) { return h('li', { text: t }); }))),
      h('div', { class: 'panel' }, h('h2', { text: 'May change over time' }), h('ul', null, CP.stableVsChanging.changing.map(function (t) { return h('li', { text: t }); })))
    ));
    main.appendChild(h('p', { class: 'small muted' }, 'Lessons are original explanations written for CrydenCode, informed by the documentation above. If a link or recommendation looks out of date, check the official site and trust it over this page.'));
  };
})();
