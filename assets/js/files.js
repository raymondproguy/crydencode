/* Single list of every file in the site. Used by the service worker (offline cache)
   and by the "Download website ZIP" button. Add new files here. */
(function (root) {
  'use strict';
  root.CP_FILES = {
    version: '1.0.0',
    pages: [
      'index.html', 'roadmap.html', 'modules.html', 'lesson.html', 'editor.html', 'preview.html', 'practice.html',
      'quiz.html', 'projects.html', 'progress.html', 'bookmarks.html', 'settings.html', 'resources.html', 'offline.html'
    ],
    assets: [
      'assets/css/styles.css',
      'assets/js/files.js', 'assets/js/theme-init.js', 'assets/js/storage.js', 'assets/js/data.js', 'assets/js/lessons.js', 'assets/js/lessons-2.js',
      'assets/js/practice-data.js', 'assets/js/app.js', 'assets/js/offline.js', 'assets/js/pages-learn.js',
      'assets/js/pages-practice.js', 'assets/js/pages-more.js', 'assets/js/editor.js', 'assets/js/preview.js',
      'assets/images/hero.svg', 'assets/images/diagram-request.svg', 'assets/images/diagram-box-model.svg',
      'assets/images/icon.svg', 'assets/images/icon-192.png', 'assets/images/icon-512.png',
      'assets/images/icon-maskable-512.png', 'assets/images/apple-touch-icon.png', 'assets/images/favicon.png',
      'manifest.json'
    ],
    // Included in the ZIP only (not needed for the app to run offline).
    extra: ['sw.js', 'README.md', 'LICENSE']
  };
})(typeof self !== 'undefined' ? self : this);
