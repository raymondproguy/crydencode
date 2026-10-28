/* CrydenCode storage: one versioned object in localStorage, sanitised on every load and import. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});

  var KEY = 'crydencode:v1';
  var DRAFT_KEY = 'crydencode:v1:draft';
  var SANDBOX_KEY = 'crydencode:v1:sandbox-storage';
  var CORRUPT_KEY = 'crydencode:v1:corrupt-backup';
  var SCHEMA = 1;
  var COLORS = ['violet', 'blue', 'teal', 'pink', 'amber'];
  var THEMES = ['dark', 'light', 'system'];
  var FONTS = ['small', 'medium', 'large'];
  var MAX_DRAFT = 200000; // characters per editor tab
  var MAX_ATTEMPTS = 20;

  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function str(v, max) { return typeof v === 'string' ? v.slice(0, max || 200) : ''; }
  function num(v) { return typeof v === 'number' && isFinite(v) ? v : 0; }
  function pick(v, list, fallback) { return list.indexOf(v) !== -1 ? v : fallback; }

  function defaults() {
    return {
      schema: SCHEMA,
      profile: { name: '', color: 'violet', onboarded: false, createdAt: null },
      settings: { theme: 'dark', fontSize: 'medium' },
      progress: { lessons: {}, exercises: {}, quizzes: {}, projects: {} },
      bookmarks: [],
      activity: {},
      recent: [],
      lastLesson: null
    };
  }

  /* Rebuild a trusted state object from untrusted input. Unknown fields are dropped. */
  function sanitize(raw) {
    var s = defaults();
    if (!isObj(raw)) return s;

    if (isObj(raw.profile)) {
      s.profile.name = str(raw.profile.name, 40).trim();
      s.profile.color = pick(raw.profile.color, COLORS, 'violet');
      s.profile.onboarded = raw.profile.onboarded === true;
      s.profile.createdAt = num(raw.profile.createdAt) || null;
    }
    if (isObj(raw.settings)) {
      s.settings.theme = pick(raw.settings.theme, THEMES, 'dark');
      s.settings.fontSize = pick(raw.settings.fontSize, FONTS, 'medium');
    }
    if (isObj(raw.progress)) {
      var p = raw.progress;
      ['lessons', 'exercises'].forEach(function (group) {
        if (!isObj(p[group])) return;
        Object.keys(p[group]).slice(0, 500).forEach(function (id) {
          var item = p[group][id];
          if (id.length <= 60 && isObj(item) && item.done === true) s.progress[group][id] = { done: true, at: num(item.at) };
        });
      });
      if (isObj(p.quizzes)) {
        Object.keys(p.quizzes).slice(0, 50).forEach(function (id) {
          var q = p.quizzes[id];
          if (id.length > 60 || !isObj(q)) return;
          var attempts = Array.isArray(q.attempts) ? q.attempts.slice(-MAX_ATTEMPTS).filter(isObj).map(function (a) {
            return { score: Math.max(0, Math.floor(num(a.score))), total: Math.max(1, Math.floor(num(a.total))), at: num(a.at) };
          }).filter(function (a) { return a.score <= a.total; }) : [];
          s.progress.quizzes[id] = { best: Math.max(0, Math.floor(num(q.best))), total: Math.max(0, Math.floor(num(q.total))), attempts: attempts };
        });
      }
      if (isObj(p.projects)) {
        Object.keys(p.projects).slice(0, 50).forEach(function (id) {
          var pr = p.projects[id];
          if (id.length > 60 || !isObj(pr) || !Array.isArray(pr.checks)) return;
          s.progress.projects[id] = { checks: pr.checks.slice(0, 30).map(function (c) { return c === true; }), at: num(pr.at) };
        });
      }
    }
    if (Array.isArray(raw.bookmarks)) {
      raw.bookmarks.slice(0, 300).forEach(function (b) {
        if (isObj(b) && (b.type === 'lesson' || b.type === 'resource') && typeof b.id === 'string' && b.id.length <= 60) {
          s.bookmarks.push({ type: b.type, id: b.id, at: num(b.at) });
        }
      });
    }
    if (isObj(raw.activity)) {
      Object.keys(raw.activity).slice(0, 800).forEach(function (day) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(day) && num(raw.activity[day]) > 0) s.activity[day] = Math.min(9999, Math.floor(num(raw.activity[day])));
      });
    }
    if (Array.isArray(raw.recent)) {
      s.recent = raw.recent.filter(function (id) { return typeof id === 'string' && id.length <= 60; }).slice(0, 8);
    }
    s.lastLesson = typeof raw.lastLesson === 'string' && raw.lastLesson.length <= 60 ? raw.lastLesson : null;
    return s;
  }

  var state = null;
  var storageOk = true;

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { storageOk = false; return null; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (e) { storageOk = false; return false; }
  }

  function load() {
    var raw = read(KEY);
    if (raw === null) return defaults();
    try {
      return sanitize(JSON.parse(raw));
    } catch (e) {
      write(CORRUPT_KEY, raw.slice(0, 100000)); // keep the unreadable data instead of silently losing it
      return defaults();
    }
  }

  function get() { if (!state) state = load(); return state; }
  function save() { return write(KEY, JSON.stringify(get())); }
  function update(fn) { fn(get()); return save(); }

  function dayKey(date) {
    var d = date || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function logActivity() {
    var key = dayKey();
    update(function (s) { s.activity[key] = (s.activity[key] || 0) + 1; });
  }

  /* ---- Drafts for the editor ---- */
  function getDraft() {
    var raw = read(DRAFT_KEY);
    if (!raw) return null;
    try {
      var d = JSON.parse(raw);
      if (!isObj(d)) return null;
      return { html: str(d.html, MAX_DRAFT), css: str(d.css, MAX_DRAFT), js: str(d.js, MAX_DRAFT), source: str(d.source, 80), updatedAt: num(d.updatedAt) };
    } catch (e) { return null; }
  }
  function setDraft(d) {
    return write(DRAFT_KEY, JSON.stringify({
      html: str(d.html, MAX_DRAFT), css: str(d.css, MAX_DRAFT), js: str(d.js, MAX_DRAFT), source: str(d.source, 80), updatedAt: Date.now()
    }));
  }

  /* ---- Data the sandboxed preview "saves" for learner code that uses localStorage ---- */
  function getSandboxData() {
    var raw = read(SANDBOX_KEY);
    try {
      var d = raw ? JSON.parse(raw) : {};
      var out = {};
      if (isObj(d)) Object.keys(d).slice(0, 100).forEach(function (k) { if (typeof d[k] === 'string') out[k.slice(0, 100)] = d[k].slice(0, 50000); });
      return out;
    } catch (e) { return {}; }
  }
  function setSandboxData(data) {
    var out = {};
    if (isObj(data)) Object.keys(data).slice(0, 100).forEach(function (k) { if (typeof data[k] === 'string') out[k.slice(0, 100)] = data[k].slice(0, 50000); });
    write(SANDBOX_KEY, JSON.stringify(out));
  }
  function clearSandboxData() { try { window.localStorage.removeItem(SANDBOX_KEY); } catch (e) { /* ignore */ } }

  /* ---- Export / import / reset ---- */
  function exportData() {
    return JSON.stringify({ app: 'CrydenCode', schema: SCHEMA, exportedAt: new Date().toISOString(), data: get(), draft: getDraft() }, null, 2);
  }

  /* Returns { ok, error, state, draft }. Nothing is applied until applyImport(). */
  function parseImport(text) {
    var parsed;
    if (typeof text !== 'string' || text.length > 5000000) return { ok: false, error: 'That file is too large or empty.' };
    try { parsed = JSON.parse(text); } catch (e) { return { ok: false, error: 'That file is not valid JSON.' }; }
    if (!isObj(parsed) || parsed.app !== 'CrydenCode') return { ok: false, error: 'This does not look like a CrydenCode export.' };
    if (typeof parsed.schema !== 'number' || parsed.schema < 1) return { ok: false, error: 'The export has no valid version number.' };
    if (parsed.schema > SCHEMA) return { ok: false, error: 'This export is from a newer version of CrydenCode. Update the app and try again.' };
    if (!isObj(parsed.data)) return { ok: false, error: 'The export has no learner data inside.' };
    var draft = null;
    if (isObj(parsed.draft)) draft = { html: str(parsed.draft.html, MAX_DRAFT), css: str(parsed.draft.css, MAX_DRAFT), js: str(parsed.draft.js, MAX_DRAFT), source: str(parsed.draft.source, 80) };
    var clean = sanitize(parsed.data);
    clean.profile.onboarded = true;
    return { ok: true, state: clean, draft: draft };
  }
  function applyImport(result) {
    state = result.state;
    var ok = save();
    if (result.draft) setDraft(result.draft);
    return ok;
  }
  function reset() {
    state = defaults();
    try {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem(DRAFT_KEY);
      window.localStorage.removeItem(SANDBOX_KEY);
      window.localStorage.removeItem(CORRUPT_KEY);
    } catch (e) { /* ignore */ }
  }

  CP.store = {
    KEY: KEY, SCHEMA: SCHEMA, COLORS: COLORS,
    get: get, save: save, update: update, dayKey: dayKey, logActivity: logActivity,
    getDraft: getDraft, setDraft: setDraft,
    getSandboxData: getSandboxData, setSandboxData: setSandboxData, clearSandboxData: clearSandboxData,
    exportData: exportData, parseImport: parseImport, applyImport: applyImport, reset: reset,
    isAvailable: function () { get(); return storageOk; },
    sanitize: sanitize
  };
})();
