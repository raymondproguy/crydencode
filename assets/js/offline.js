/* Offline support: service worker registration, honest status, PWA install, and a real ZIP download. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});

  var off = (CP.offline = {
    state: { code: 'unknown', text: 'Checking…', detail: '' },
    listeners: [],
    installEvent: null,
    subscribe: function (fn) { off.listeners.push(fn); },
    set: function (code, text, detail) {
      off.state = { code: code, text: text, detail: detail || '' };
      off.listeners.forEach(function (fn) { try { fn(off.state); } catch (e) { /* ignore */ } });
    }
  });

  function askStatus(worker) {
    return new Promise(function (resolve, reject) {
      var channel = new MessageChannel();
      var timer = setTimeout(function () { reject(new Error('no reply')); }, 4000);
      channel.port1.onmessage = function (e) { clearTimeout(timer); resolve(e.data); };
      worker.postMessage({ type: 'STATUS' }, [channel.port2]);
    });
  }

  off.check = function (attempt) {
    attempt = attempt || 0;
    if (!('serviceWorker' in navigator)) { off.set('unsupported', 'Not supported', 'This browser cannot save the site for offline use.'); return Promise.resolve(); }
    if (!window.isSecureContext) { off.set('unsupported', 'Needs HTTPS', 'Offline use needs HTTPS or localhost. Open the site from a secure address.'); return Promise.resolve(); }
    return navigator.serviceWorker.getRegistration().then(function (reg) {
      var worker = reg && (reg.active || reg.waiting || reg.installing);
      if (!worker) { off.set('preparing', 'Preparing offline files…', 'The first visit saves the files. Keep this page open.'); return null; }
      if (!reg.active) { off.set('preparing', 'Preparing offline files…', 'Saving files for offline use.'); return null; }
      return askStatus(reg.active).then(function (s) {
        if (s.cached === s.total) off.set('ready', 'Offline-ready', 'All ' + s.total + ' files are saved on this device (version ' + s.version + ').');
        else if (attempt < 5) { off.set('preparing', 'Preparing offline files…', s.cached + ' of ' + s.total + ' files saved.'); setTimeout(function () { off.check(attempt + 1); }, 1500); }
        else off.set('error', 'Some files are missing', s.cached + ' of ' + s.total + ' files saved. Reload while online to try again.');
      });
    }).catch(function () {
      if (attempt < 3) setTimeout(function () { off.check(attempt + 1); }, 1500);
      else off.set('error', 'Could not check offline files', 'Reload the page while online to try again.');
    });
  };

  off.register = function () {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) { off.check(); return; }
    off.set('preparing', 'Preparing offline files…', 'Saving files for offline use.');
    navigator.serviceWorker.register('sw.js').then(function () {
      return navigator.serviceWorker.ready;
    }).then(function () { return off.check(); }).catch(function (e) {
      if (window.console) console.warn('Service worker registration failed:', e);
      off.set('error', 'Offline setup failed', 'The offline files could not be saved. The site still works online.');
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () { off.check(); });
  };

  /* ---- Install as an app (PWA) ---- */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    off.installEvent = e;
    off.listeners.forEach(function (fn) { fn(off.state); });
  });
  window.addEventListener('appinstalled', function () { off.installEvent = null; off.set(off.state.code, off.state.text, off.state.detail); });
  off.canInstall = function () { return !!off.installEvent; };
  off.isStandalone = function () {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  };
  off.promptInstall = function () {
    if (!off.installEvent) return Promise.resolve('unavailable');
    var ev = off.installEvent;
    off.installEvent = null;
    ev.prompt();
    return ev.userChoice.then(function (c) { return c.outcome; });
  };

  /* ---- ZIP of the whole website (store method, no dependency) ---- */
  var CRC_TABLE = null;
  function crc32(bytes) {
    if (!CRC_TABLE) {
      CRC_TABLE = new Uint32Array(256);
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        CRC_TABLE[n] = c >>> 0;
      }
    }
    var crc = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  function dosDateTime(d) {
    var time = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
    var date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    return { time: time & 0xFFFF, date: date & 0xFFFF };
  }

  /* entries: [{ name, data: Uint8Array }] → Blob */
  off.buildZip = function (entries) {
    var encoder = new TextEncoder();
    var stamp = dosDateTime(new Date());
    var parts = [], central = [], offset = 0;
    entries.forEach(function (entry) {
      var name = encoder.encode(entry.name);
      var crc = crc32(entry.data);
      var size = entry.data.length;
      var local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true); local.setUint16(8, 0, true);
      local.setUint16(10, stamp.time, true); local.setUint16(12, stamp.date, true);
      local.setUint32(14, crc, true); local.setUint32(18, size, true); local.setUint32(22, size, true);
      local.setUint16(26, name.length, true); local.setUint16(28, 0, true);
      parts.push(local.buffer, name, entry.data);

      var cen = new DataView(new ArrayBuffer(46));
      cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true); cen.setUint16(10, 0, true);
      cen.setUint16(12, stamp.time, true); cen.setUint16(14, stamp.date, true);
      cen.setUint32(16, crc, true); cen.setUint32(20, size, true); cen.setUint32(24, size, true);
      cen.setUint16(28, name.length, true); cen.setUint16(30, 0, true); cen.setUint16(32, 0, true); cen.setUint16(34, 0, true); cen.setUint16(36, 0, true);
      cen.setUint32(38, 0, true); cen.setUint32(42, offset, true);
      central.push(cen.buffer, name);
      offset += 30 + name.length + size;
    });
    var centralSize = 0;
    central.forEach(function (p) { centralSize += p.byteLength !== undefined ? p.byteLength : p.length; });
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(4, 0, true); end.setUint16(6, 0, true);
    end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true);
    end.setUint32(12, centralSize, true); end.setUint32(16, offset, true); end.setUint16(20, 0, true);
    return new Blob(parts.concat(central, [end.buffer]), { type: 'application/zip' });
  };

  /* Fetches every site file and downloads crydencode-website.zip. onProgress(done, total) is optional. */
  off.downloadZip = function (onProgress) {
    var list = CP_FILES.pages.concat(CP_FILES.assets, CP_FILES.extra).filter(function (p, i, a) { return a.indexOf(p) === i; });
    var done = 0;
    var entries = [];
    return list.reduce(function (chain, path) {
      return chain.then(function () {
        return fetch(path, { cache: 'no-cache' }).then(function (res) {
          if (!res.ok) throw new Error(path + ' (' + res.status + ')');
          return res.arrayBuffer();
        }).then(function (buf) {
          entries.push({ name: 'crydencode/' + path, data: new Uint8Array(buf) });
          done++;
          if (onProgress) onProgress(done, list.length);
        });
      });
    }, Promise.resolve()).then(function () {
      var blob = off.buildZip(entries);
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'crydencode-website.zip';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
      return { files: entries.length, bytes: blob.size };
    });
  };

  off.register();
})();
