/* Pages: practice (real checks), quiz, projects. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  var h = CP.h, calc = CP.calc;

  function lessonLink(id, text) {
    var l = calc.lesson(id);
    return l ? h('a', { href: 'lesson.html?id=' + encodeURIComponent(id) }, text || l.title) : null;
  }
  function statusIcon(done) {
    return h('span', { class: 'status-icon' + (done ? ' done' : ''), 'aria-hidden': 'true' }, CP.icon('check', 14));
  }

  /* ================= PRACTICE ================= */
  function escapeScript(code) { return String(code).replace(/<\/(script)/gi, '<\\/$1'); }

  function pageSource(ex, code) {
    var s = ex.starter;
    var html = ex.edit === 'html' ? code : s.html;
    var css = ex.edit === 'css' ? code : s.css;
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:system-ui,sans-serif;margin:12px}' + (css || '') + '</style></head><body>' + (html || '');
  }

  function runDomChecks(ex, code, frame) {
    return new Promise(function (resolve) {
      var doc;
      frame.onload = function () {
        try {
          doc = frame.contentDocument;
          var win = frame.contentWindow;
          var rows = ex.checks(doc, win).map(function (r) { return { label: r[0], ok: !!r[1] }; });
          resolve({ rows: rows });
        } catch (e) {
          resolve({ rows: [{ label: 'The page could not be checked. Make sure the code is complete.', ok: false }] });
        }
      };
      frame.srcdoc = pageSource(ex, code);
    });
  }

  function runJsChecks(ex, code) {
    return new Promise(function (resolve) {
      var nonce = 'cp' + Math.random().toString(36).slice(2);
      var frame = h('iframe', { sandbox: 'allow-scripts', title: 'Hidden test runner', style: 'position:absolute;width:1px;height:1px;border:0;opacity:0', 'aria-hidden': 'true', tabindex: '-1' });
      var finished = false;
      function done(result) {
        if (finished) return;
        finished = true;
        window.removeEventListener('message', onMessage);
        clearTimeout(timer);
        frame.remove();
        resolve(result);
      }
      function onMessage(e) {
        if (e.source !== frame.contentWindow || !e.data || e.data.cp !== nonce) return;
        var results = Array.isArray(e.data.results) ? e.data.results : [];
        done({ rows: results.map(function (r) { return { label: String(r.label), ok: r.ok === true, got: String(r.got || '') }; }), error: typeof e.data.error === 'string' ? e.data.error : null });
      }
      window.addEventListener('message', onMessage);
      var timer = setTimeout(function () { done({ rows: [], timeout: true }); }, 3000);
      var tests = JSON.stringify(ex.tests).replace(/</g, '\\u003c');
      var harness = '(function(){var tests=' + tests + ';var results=[];function eq(a,b){return JSON.stringify(a)===JSON.stringify(b);}' +
        'tests.forEach(function(t){try{var r=(0,eval)(t.expr);results.push({label:t.label,ok:eq(r,t.expect),got:JSON.stringify(r)});}catch(err){results.push({label:t.label,ok:false,got:"Error: "+err.message});}});' +
        'parent.postMessage({cp:' + JSON.stringify(nonce) + ',results:results,error:window.__cpErr||null},"*");})();';
      var src = '<!doctype html><html><head><meta charset="utf-8"><style>' + (ex.starter.css || '') + '</style></head><body>' + (ex.starter.html || '') +
        '<script>window.addEventListener("error",function(e){window.__cpErr=window.__cpErr||e.message;});' + CP.LOOP_PRELUDE + '<\/script>' +
        '<script>' + escapeScript(CP.guardLoops(code)) + '\n<\/script><script>' + escapeScript(harness) + '<\/script></body></html>';
      frame.srcdoc = src;
      document.body.appendChild(frame);
    });
  }

  CP.pages.practice = function (main) {
    var track = 'all';
    var head = CP.pageHead('Practice', 'Practice exercises', 'Write code and press Check. Each exercise is tested for real, so you only get a tick when it works.');
    var listWrap = h('div');
    main.append(head, listWrap);

    function showList() {
      CP.clear(listWrap);
      history.replaceState(null, '', location.pathname);
      var filters = [['all', 'All'], ['html', 'HTML'], ['css', 'CSS'], ['js', 'JavaScript']];
      var chips = h('div', { class: 'chip-row', role: 'group', 'aria-label': 'Filter exercises' });
      var results = h('div');
      function paint() {
        CP.clear(results);
        var list = CP.exercises.filter(function (e) { return track === 'all' || e.track === track; });
        var done = list.filter(function (e) { return CP.store.get().progress.exercises[e.id]; }).length;
        results.appendChild(h('p', { class: 'small muted', text: done + ' of ' + list.length + ' completed' }));
        results.appendChild(h('ul', { class: 'rows' }, list.map(function (e) {
          var isDone = !!CP.store.get().progress.exercises[e.id];
          var a = h('a', { class: 'row', href: '#' + e.id },
            statusIcon(isDone),
            h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: e.title }), h('span', { class: 'row-meta' }, h('span', { class: 'badge', text: CP.TRACKS[e.track] }), h('span', { text: e.task.length > 70 ? e.task.slice(0, 68) + '…' : e.task }))),
            h('span', { class: 'row-end' }, CP.icon('chevron', 18)));
          a.addEventListener('click', function (ev) { ev.preventDefault(); showExercise(e); });
          return h('li', null, a);
        })));
      }
      filters.forEach(function (f) {
        var b = h('button', { class: 'chip', type: 'button', 'aria-pressed': String(f[0] === track), text: f[1] });
        b.addEventListener('click', function () { track = f[0]; chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); }); paint(); });
        chips.appendChild(b);
      });
      listWrap.append(chips, results);
      paint();
    }

    function showExercise(ex) {
      history.replaceState(null, '', '#' + ex.id);
      CP.clear(listWrap);
      var lang = ex.edit;
      var code = ex.starter[lang] || '';
      var area = h('textarea', { class: 'code-area short', id: 'ex-code', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', 'aria-label': 'Your ' + lang.toUpperCase() + ' code', style: 'min-height:200px' });
      area.value = code;
      var feedback = h('div', { role: 'status', 'aria-live': 'polite' });
      var preview = ex.kind === 'js' ? null : h('iframe', { class: 'preview-frame', sandbox: 'allow-same-origin', title: 'Result preview', style: 'height:180px;min-height:140px' });
      var checkBtn = h('button', { class: 'btn', type: 'button' }, CP.icon('check', 18), 'Check my code');
      var resetBtn = h('button', { class: 'btn btn-secondary', type: 'button', text: 'Reset' });
      var showBtn = h('button', { class: 'btn btn-ghost', type: 'button', text: 'Show a possible answer' });
      var back = h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: showList }, CP.icon('left', 16), 'All exercises');

      if (preview) preview.srcdoc = pageSource(ex, area.value);

      function check() {
        checkBtn.disabled = true;
        CP.clear(feedback).appendChild(h('p', null, h('span', { class: 'spinner' }), ' Checking…'));
        var code = area.value;
        var run = ex.kind === 'js' ? runJsChecks(ex, code) : runDomChecks(ex, code, preview);
        run.then(function (res) {
          CP.clear(feedback);
          if (res.timeout) {
            feedback.appendChild(h('div', { class: 'callout tip' }, h('strong', { text: 'That took too long' }), h('p', { text: 'The code did not finish in 3 seconds. Look for a loop that never ends, then try again.' })));
            return;
          }
          var ok = res.rows.length > 0 && res.rows.every(function (r) { return r.ok; });
          var list = h('ul', { class: 'feedback-list' }, res.rows.map(function (r) {
            return h('li', null, h('span', { class: r.ok ? 'ok' : 'no' }, CP.icon(r.ok ? 'check' : 'x', 18)), h('span', null, h('span', { class: 'visually-hidden', text: r.ok ? 'Passed: ' : 'Not yet: ' }), r.label, (!r.ok && r.got ? h('span', { class: 'small muted', text: ' (got ' + r.got + ')' }) : null)));
          }));
          if (res.error) feedback.appendChild(h('div', { class: 'callout security' }, h('strong', { text: 'Your code reported an error' }), h('p', { text: res.error })));
          if (ok) {
            if (!CP.store.get().progress.exercises[ex.id]) {
              CP.store.update(function (s) { s.progress.exercises[ex.id] = { done: true, at: Date.now() }; });
              CP.store.logActivity();
            }
            feedback.appendChild(h('div', { class: 'callout a11y' }, h('strong', { text: 'All checks passed!' }), h('p', { text: 'Great work. That is exactly how it is done.' })));
          } else {
            feedback.appendChild(h('p', { class: 'muted', text: 'Not quite yet. Read the lines marked with a cross, adjust, and check again. You can open the hint if you need it.' }));
          }
          feedback.appendChild(list);
        }).then(function () { checkBtn.disabled = false; });
      }
      checkBtn.addEventListener('click', check);
      resetBtn.addEventListener('click', function () {
        CP.confirm({ title: 'Reset this exercise?', message: 'Your code will go back to the starter code.', confirmLabel: 'Reset' }).then(function (yes) {
          if (!yes) return;
          area.value = ex.starter[lang] || '';
          CP.clear(feedback);
          if (preview) preview.srcdoc = pageSource(ex, area.value);
        });
      });
      showBtn.addEventListener('click', function () {
        CP.confirm({ title: 'Show a possible answer?', message: 'Try the hint first. Seeing the answer replaces your code with one possible solution.', confirmLabel: 'Show answer' }).then(function (yes) {
          if (yes) { area.value = ex.solution; if (preview) preview.srcdoc = pageSource(ex, area.value); }
        });
      });
      if (preview) {
        var timer = null;
        area.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { preview.srcdoc = pageSource(ex, area.value); }, 400); });
      }

      var done = !!CP.store.get().progress.exercises[ex.id];
      listWrap.append(
        back,
        h('div', { class: 'stack', style: 'margin-top:12px' },
          h('div', null,
            h('p', { class: 'eyebrow', text: CP.TRACKS[ex.track] + ' exercise' }),
            h('h2', { text: ex.title }),
            done ? h('span', { class: 'badge badge-ok' }, CP.icon('check', 12), 'Completed') : null,
            h('p', { text: ex.task }),
            h('details', null, h('summary', { text: 'Show hint' }), h('p', { style: 'margin-top:8px' }, CP.text(ex.hint))),
            h('p', { class: 'small', style: 'margin-top:8px' }, 'Related lesson: ', lessonLink(ex.lesson))
          ),
          h('div', { class: 'field' }, h('label', { for: 'ex-code', text: 'Your ' + (lang === 'js' ? 'JavaScript' : lang.toUpperCase()) + ' code' }), area),
          h('div', { class: 'btn-row' }, checkBtn, resetBtn, showBtn),
          feedback,
          preview ? h('div', null, h('h3', { text: 'Preview' }), preview) : null
        )
      );
    }

    var wanted = CP.exercises.filter(function (e) { return e.id === location.hash.slice(1); })[0];
    if (wanted) showExercise(wanted); else showList();
  };

  /* ================= QUIZ ================= */
  CP.pages.quiz = function (main) {
    var wrap = h('div');
    main.append(CP.pageHead('Quizzes', 'Test your knowledge', 'Five or six questions per quiz, one at a time, with an explanation for every answer.'), wrap);

    function showPicker() {
      history.replaceState(null, '', location.pathname);
      CP.clear(wrap);
      var saved = CP.store.get().progress.quizzes;
      wrap.appendChild(h('ul', { class: 'rows' }, CP.quizzes.map(function (qz) {
        var rec = saved[qz.id];
        var a = h('a', { class: 'row', href: '#' + qz.id },
          h('span', { class: 'track-tile', 'data-track': qz.id === 'tools' ? 'tools' : qz.id, text: qz.id === 'tools' ? 'DEV' : CP.TRACK_TILE[qz.id] }),
          h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: qz.title }), h('span', { class: 'row-meta' }, h('span', { text: qz.questions.length + ' questions' }), h('span', { text: qz.blurb }))),
          h('span', { class: 'row-end' }, rec && rec.attempts.length ? h('span', { class: 'badge badge-ok', text: 'Best ' + rec.best + '/' + rec.total }) : h('span', { class: 'badge', text: 'Not taken' }), CP.icon('chevron', 18)));
        a.addEventListener('click', function (e) { e.preventDefault(); start(qz); });
        return h('li', null, a);
      })));
    }

    function start(qz) {
      history.replaceState(null, '', '#' + qz.id);
      var index = 0, score = 0, answers = [];
      function render() {
        CP.clear(wrap);
        var qu = qz.questions[index];
        var total = qz.questions.length;
        var checked = false;
        var legend = h('legend', { id: 'q-text', style: 'font-weight:700;font-size:1.1rem;margin-bottom:12px', text: (index + 1) + '. ' + qu.q });
        var opts = h('fieldset', { class: 'options', 'aria-labelledby': 'q-text' }, legend);
        var inputs = qu.options.map(function (text, i) {
          var input = h('input', { type: 'radio', name: 'answer', value: String(i), id: 'opt-' + i });
          var label = h('label', { class: 'option', for: 'opt-' + i }, input, h('span', null, text));
          opts.appendChild(label);
          return { input: input, label: label };
        });
        var fb = h('div', { role: 'status', 'aria-live': 'polite' });
        var checkBtn = h('button', { class: 'btn btn-block', type: 'button', text: 'Check answer', disabled: true });
        var nextBtn = h('button', { class: 'btn btn-block', type: 'button', text: index === total - 1 ? 'See my score' : 'Next question', hidden: true });
        inputs.forEach(function (o) { o.input.addEventListener('change', function () { checkBtn.disabled = false; }); });
        checkBtn.addEventListener('click', function () {
          var chosen = inputs.map(function (o) { return o.input.checked; }).indexOf(true);
          if (chosen === -1 || checked) return;
          checked = true;
          var right = chosen === qu.answer;
          if (right) score++;
          answers.push({ q: qu.q, chosen: qu.options[chosen], correct: qu.options[qu.answer], right: right, lesson: qu.lesson });
          inputs.forEach(function (o, i) {
            o.input.disabled = true;
            if (i === qu.answer) o.label.classList.add('correct');
            else if (i === chosen) o.label.classList.add('wrong');
          });
          CP.clear(fb).appendChild(h('div', { class: 'callout ' + (right ? 'a11y' : 'tip') },
            h('strong', { text: right ? 'Correct!' : 'Not quite. The answer is: ' + qu.options[qu.answer] }),
            h('p', { text: qu.why }),
            h('p', { class: 'small', style: 'margin:0' }, 'Review: ', lessonLink(qu.lesson))));
          checkBtn.hidden = true; nextBtn.hidden = false; nextBtn.focus();
        });
        nextBtn.addEventListener('click', function () { index++; if (index < total) render(); else finish(); });
        wrap.append(
          h('div', { class: 'section-head' }, h('p', { class: 'small muted', style: 'margin:0', text: qz.title + ' · Question ' + (index + 1) + ' of ' + total }), h('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Quit', onclick: function () { CP.confirm({ title: 'Quit this quiz?', message: 'Your answers so far will not be saved.', confirmLabel: 'Quit' }).then(function (y) { if (y) showPicker(); }); } })),
          CP.progressBar(Math.round((index / total) * 100), false, 'Quiz progress'),
          h('div', { style: 'margin-top:20px' }, opts, fb, checkBtn, nextBtn)
        );
        (inputs[0] && inputs[0].input).focus({ preventScroll: true });
      }

      function finish() {
        var total = qz.questions.length;
        CP.store.update(function (s) {
          var rec = s.progress.quizzes[qz.id] || { best: 0, total: total, attempts: [] };
          rec.attempts.push({ score: score, total: total, at: Date.now() });
          rec.attempts = rec.attempts.slice(-20);
          rec.best = Math.max(rec.best, score);
          rec.total = total;
          s.progress.quizzes[qz.id] = rec;
        });
        CP.store.logActivity();
        var pct = Math.round((score / total) * 100);
        var msg = pct === 100 ? 'Perfect score!' : pct >= 70 ? 'Great work!' : pct >= 50 ? 'Good start. Review the lessons below and try again.' : 'Keep going. Read the lessons marked below, then retake it.';
        CP.clear(wrap).append(
          h('div', { class: 'panel panel-accent', style: 'text-align:center' },
            h('p', { class: 'eyebrow', text: 'Quiz complete' }),
            h('h2', { text: score + ' out of ' + total }),
            h('p', { class: 'muted', text: pct + '%. ' + msg }),
            h('div', { class: 'btn-row', style: 'justify-content:center' },
              h('button', { class: 'btn', type: 'button', text: 'Retake quiz', onclick: function () { start(qz); } }),
              h('button', { class: 'btn btn-secondary', type: 'button', text: 'All quizzes', onclick: showPicker }))),
          h('h2', { class: 'section', text: 'Your answers' }),
          h('ul', { class: 'rows' }, answers.map(function (a) {
            return h('li', null, h('div', { class: 'row', style: 'align-items:flex-start' },
              h('span', { class: 'status-icon' + (a.right ? ' done' : ''), style: a.right ? '' : 'border-color:var(--danger);color:var(--danger)' }, CP.icon(a.right ? 'check' : 'x', 14)),
              h('div', { class: 'row-main' }, h('span', { class: 'row-title', text: a.q }),
                h('span', { class: 'row-meta' }, a.right ? 'You answered: ' + a.correct : 'You answered: ' + a.chosen + '. Correct: ' + a.correct), a.right ? null : h('span', { class: 'small' }, 'Review: ', lessonLink(a.lesson)))));
          }))
        );
        window.scrollTo(0, 0);
      }
      render();
    }

    var wanted = CP.quizzes.filter(function (q) { return q.id === location.hash.slice(1); })[0];
    if (wanted) start(wanted); else showPicker();
  };

  /* ================= PROJECTS ================= */
  CP.pages.projects = function (main) {
    var wrap = h('div');
    main.append(CP.pageHead('Build', 'Projects', 'Seven projects, from easy to advanced. Each has requirements, hints and a checklist that updates your progress.'), wrap);

    function showList() {
      history.replaceState(null, '', location.pathname);
      CP.clear(wrap);
      wrap.appendChild(h('ul', { class: 'rows' }, CP.projects.map(function (p, i) {
        var st = calc.projectState(p.id);
        var a = h('a', { class: 'row', href: '#' + p.id },
          h('span', { class: 'stage-num' + (st.status === 'complete' ? ' done' : ''), text: String(i + 1) }),
          h('span', { class: 'row-main' }, h('span', { class: 'row-title', text: p.title }),
            h('span', { class: 'row-meta' }, h('span', { class: 'badge ' + (p.level === 'Beginner' ? 'badge-ok' : p.level === 'Intermediate' ? 'badge-warn' : 'badge-info'), text: p.level }), h('span', { text: '~' + CP.fmtMinutes(p.minutes) }), h('span', { text: st.checked + '/' + st.total + ' done' }), p.needsInternet ? h('span', { class: 'badge', text: 'Needs internet' }) : null)),
          h('span', { class: 'row-end' }, CP.icon('chevron', 18)));
        a.addEventListener('click', function (e) { e.preventDefault(); showProject(p); });
        return h('li', null, a);
      })));
    }

    function showProject(p) {
      history.replaceState(null, '', '#' + p.id);
      CP.clear(wrap);
      var status = h('p', { role: 'status', 'aria-live': 'polite', class: 'badge' });
      var bar = h('div');
      function paintStatus() {
        var st = calc.projectState(p.id);
        status.textContent = st.status === 'complete' ? 'Project complete' : st.checked + ' of ' + st.total + ' checklist items done';
        status.className = 'badge ' + (st.status === 'complete' ? 'badge-ok' : 'badge-accent');
        CP.clear(bar).appendChild(CP.progressBar(Math.round((st.checked / st.total) * 100), st.status === 'complete', 'Project checklist progress'));
      }
      var saved = CP.store.get().progress.projects[p.id];
      var boxes = p.checklist.map(function (text, i) {
        var id = 'chk-' + i;
        var input = h('input', { type: 'checkbox', id: id });
        input.checked = !!(saved && saved.checks[i]);
        input.addEventListener('change', function () {
          var wasComplete = calc.projectState(p.id).status === 'complete';
          CP.store.update(function (s) {
            var rec = s.progress.projects[p.id] || { checks: [], at: 0 };
            while (rec.checks.length < p.checklist.length) rec.checks.push(false);
            rec.checks[i] = input.checked;
            rec.at = Date.now();
            s.progress.projects[p.id] = rec;
          });
          CP.store.logActivity();
          paintStatus();
          if (!wasComplete && calc.projectState(p.id).status === 'complete') CP.toast('Project complete. Well done!');
        });
        return h('li', null, input, h('label', { for: id, text: text }));
      });

      function list(items) { return h('ul', null, items.map(function (t) { return h('li', { text: t }); })); }
      wrap.append(
        h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: showList }, CP.icon('left', 16), 'All projects'),
        h('div', { class: 'stack', style: 'margin-top:12px' },
          h('div', null, h('p', { class: 'eyebrow', text: p.level + ' · about ' + CP.fmtMinutes(p.minutes) }), h('h2', { text: p.title }), h('p', { text: p.summary }),
            p.needsInternet ? h('div', { class: 'callout tip' }, h('strong', { text: 'Needs internet' }), h('p', { text: 'This project fetches data from a public API, so it only works online, and only while that service is available.' })) : null),
          h('section', null, h('h3', { text: 'Skills you will practise' }), h('p', { text: p.skills.join(' · ') })),
          h('section', null, h('h3', { text: 'Requirements' }), list(p.requirements)),
          h('section', null, h('h3', { text: 'Recommended steps' }), h('ol', null, p.steps.map(function (t) { return h('li', { text: t }); }))),
          h('details', null, h('summary', { text: 'Hints' }), h('div', { style: 'margin-top:8px' }, list(p.hints))),
          h('section', { class: 'panel' }, h('h3', { text: 'Completion checklist' }), bar, status, h('ul', { class: 'check-list', style: 'margin-top:8px' }, boxes)),
          h('section', null, h('h3', { text: 'Stretch goals (optional)' }), list(p.stretch)),
          h('section', null, h('h3', { text: 'Lessons that help' }), h('ul', null, p.lessons.map(function (id) { return h('li', null, lessonLink(id)); }))),
          p.starter ? h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onclick: function () { CP.openInEditor(p.starter, p.title + ' (starter)'); } }, CP.icon('code', 18), 'Open starter code in the editor')) : null
        )
      );
      paintStatus();
    }

    var wanted = CP.projects.filter(function (p) { return p.id === location.hash.slice(1); })[0];
    if (wanted) showProject(wanted); else showList();
  };
})();
