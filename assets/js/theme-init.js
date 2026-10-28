/* Runs before first paint so the saved theme and text size apply without a flash. */
(function () {
  try {
    var raw = window.localStorage.getItem('crydencode:v1');
    var settings = raw ? (JSON.parse(raw).settings || {}) : {};
    var theme = settings.theme;
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches && theme === 'system' ? 'light' : 'dark';
    }
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (settings.fontSize === 'small' || settings.fontSize === 'large') root.setAttribute('data-font', settings.fontSize);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
