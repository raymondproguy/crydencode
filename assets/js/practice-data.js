/* Practice exercises (with real automatic checks) and quiz questions.
   kind "html"/"css": the learner edits one language; checks run on the rendered page (no scripts run).
   kind "js": the code runs in a sandboxed iframe, then each test expression is evaluated and compared. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});

  function q(sel, doc) { return doc.querySelector(sel); }
  function rgb(str) { var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(str || ''); return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0]; }

  /* Computed margins are 0 when the preview is narrower than max-width, so read the written rule instead. */
  function autoMargins(doc, selector) {
    for (var i = 0; i < doc.styleSheets.length; i++) {
      var rules = doc.styleSheets[i].cssRules || [];
      for (var j = 0; j < rules.length; j++) {
        if (rules[j].selectorText === selector && rules[j].style.marginLeft === 'auto' && rules[j].style.marginRight === 'auto') return true;
      }
    }
    return false;
  }

  CP.exercises = [
    /* ---------- HTML ---------- */
    {
      id: 'ex-html-landmarks', track: 'html', kind: 'html', edit: 'html', lesson: 'html-structure', title: 'Add page landmarks',
      task: 'Wrap the content in a header (with the h1), a main (with the paragraphs) and a footer.',
      hint: 'Put <header> around the h1, <main> around the two paragraphs, and make the last paragraph live in <footer>.',
      starter: { html: '<h1>My site</h1>\n<p>Welcome to my site.</p>\n<p>Contact me soon.</p>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; }' },
      solution: '<header>\n  <h1>My site</h1>\n</header>\n<main>\n  <p>Welcome to my site.</p>\n</main>\n<footer>\n  <p>Contact me soon.</p>\n</footer>',
      checks: function (doc) {
        return [
          ['There is a <header> element', !!q('header', doc)],
          ['The <h1> is inside the header', !!q('header h1', doc)],
          ['There is one <main> element', doc.querySelectorAll('main').length === 1],
          ['There is a <footer> element', !!q('footer', doc)],
          ['There is still exactly one <h1>', doc.querySelectorAll('h1').length === 1]
        ];
      }
    },
    {
      id: 'ex-html-link', track: 'html', kind: 'html', edit: 'html', lesson: 'html-text-links', title: 'Write a good link',
      task: 'Turn the words "the MDN site" into a link to https://developer.mozilla.org/ . The link text should describe where it goes.',
      hint: 'Use <a href="https://developer.mozilla.org/">the MDN site</a> inside the paragraph.',
      starter: { html: '<h1>Resources</h1>\n<p>I use the MDN site to look things up.</p>', css: '' },
      solution: '<h1>Resources</h1>\n<p>I use <a href="https://developer.mozilla.org/">the MDN site</a> to look things up.</p>',
      checks: function (doc) {
        var a = q('a', doc);
        var text = a ? a.textContent.trim().toLowerCase() : '';
        return [
          ['There is a link (<a>)', !!a],
          ['It points to https://developer.mozilla.org/', !!a && /^https:\/\/developer\.mozilla\.org\/?$/.test(a.getAttribute('href') || '')],
          ['The link text is meaningful (not "click here" or "here")', !!a && text.length > 4 && !/^(click )?here$/.test(text)],
          ['The link is inside the paragraph', !!q('p a', doc)]
        ];
      }
    },
    {
      id: 'ex-html-image-list', track: 'html', kind: 'html', edit: 'html', lesson: 'html-images-lists', title: 'Image alt text and a list',
      task: 'Make the three hobbies a bulleted list and give the image helpful alt text (not empty, not "image").',
      hint: 'Use <ul> with one <li> per hobby. Alt text could describe the person: alt="Me holding a book".',
      starter: { html: '<h1>About me</h1>\n<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="60" height="60">\nReading\nCoding\nWalking', css: '' },
      solution: '<h1>About me</h1>\n<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="60" height="60" alt="Me smiling at the camera">\n<ul>\n  <li>Reading</li>\n  <li>Coding</li>\n  <li>Walking</li>\n</ul>',
      checks: function (doc) {
        var img = q('img', doc);
        var alt = img ? (img.getAttribute('alt') || '').trim().toLowerCase() : '';
        var lis = doc.querySelectorAll('ul > li');
        return [
          ['There is a <ul> list with three items', lis.length === 3],
          ['The items are Reading, Coding and Walking', lis.length === 3 && ['reading', 'coding', 'walking'].every(function (w, i) { return lis[i].textContent.trim().toLowerCase() === w; })],
          ['The image has an alt attribute that is not empty', alt.length > 0],
          ['The alt text describes the image (not just "image" or "photo")', alt.length > 5 && !/^(image|photo|picture)$/.test(alt)]
        ];
      }
    },
    {
      id: 'ex-html-form', track: 'html', kind: 'html', edit: 'html', lesson: 'html-forms', title: 'Build an email field',
      task: 'Inside the form add a label and a required email input that are linked together, plus a submit button.',
      hint: 'Match the label\'s for with the input\'s id: <label for="email">…</label><input id="email" type="email" required>.',
      starter: { html: '<form>\n  <!-- add your label, input and button here -->\n</form>', css: 'label, input, button { display: block; margin: 8px 0; }' },
      solution: '<form>\n  <label for="email">Email address</label>\n  <input id="email" name="email" type="email" required>\n  <button type="submit">Send</button>\n</form>',
      checks: function (doc) {
        var input = q('form input[type="email"]', doc);
        var label = input && input.id ? q('label[for="' + input.id + '"]', doc) : null;
        return [
          ['The form has an input with type="email"', !!input],
          ['The input is required', !!input && input.required],
          ['The input has an id', !!input && !!input.id],
          ['A <label> is linked to it with matching for and id', !!label && label.textContent.trim().length > 0],
          ['There is a submit button', !!q('form button[type="submit"], form button:not([type]), form input[type="submit"]', doc)]
        ];
      }
    },

    /* ---------- CSS ---------- */
    {
      id: 'ex-css-class', track: 'css', kind: 'css', edit: 'css', lesson: 'css-selectors', title: 'Select by class',
      task: 'Write one rule so only the paragraph with the class "highlight" gets a yellow background.',
      hint: 'Use a class selector: .highlight { background: yellow; }',
      starter: { html: '<p>Normal text</p>\n<p class="highlight">Important text</p>', css: '/* write your rule here */\n' },
      solution: '.highlight {\n  background: yellow;\n}',
      checks: function (doc, win) {
        var hi = q('.highlight', doc), plain = q('p:not(.highlight)', doc);
        var hiBg = rgb(win.getComputedStyle(hi).backgroundColor), plainBg = win.getComputedStyle(plain).backgroundColor;
        return [
          ['The highlighted paragraph has a yellow-ish background', hiBg[0] > 200 && hiBg[1] > 200 && hiBg[2] < 150],
          ['The normal paragraph has no background colour', plainBg === 'rgba(0, 0, 0, 0)' || plainBg === 'transparent']
        ];
      }
    },
    {
      id: 'ex-css-box', track: 'css', kind: 'css', edit: 'css', lesson: 'css-box-model', title: 'Style a centred box',
      task: 'Give .box padding, a border, rounded corners and a max-width, and centre it horizontally with auto margins.',
      hint: 'Try: padding: 1rem; border: 2px solid #6a47f2; border-radius: 12px; max-width: 20rem; margin: 1rem auto;',
      starter: { html: '<div class="box">Hello box</div>', css: '.box {\n  background: #eef;\n}' },
      solution: '.box {\n  background: #eef;\n  padding: 1rem;\n  border: 2px solid #6a47f2;\n  border-radius: 12px;\n  max-width: 20rem;\n  margin: 1rem auto;\n}',
      checks: function (doc, win) {
        var s = win.getComputedStyle(q('.box', doc));
        var bw = parseFloat(s.borderTopWidth) || 0;
        return [
          ['The box has padding', parseFloat(s.paddingTop) > 0],
          ['The box has a visible border', bw > 0 && s.borderTopStyle !== 'none'],
          ['The box has rounded corners', parseFloat(s.borderTopLeftRadius) > 0],
          ['The box has a max-width', s.maxWidth !== 'none'],
          ['The box is centred with auto left and right margins', autoMargins(doc, '.box')]
        ];
      }
    },
    {
      id: 'ex-css-flex', track: 'css', kind: 'css', edit: 'css', lesson: 'css-flexbox', title: 'Lay out a row with Flexbox',
      task: 'Make .row a flex container with space between the items, a gap, and wrapping allowed.',
      hint: 'On .row use display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;',
      starter: { html: '<div class="row">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>', css: '.item { background: #e5ddff; padding: 1rem; }\n.row {\n  /* your layout here */\n}' },
      solution: '.item { background: #e5ddff; padding: 1rem; }\n.row {\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 1rem;\n}',
      checks: function (doc, win) {
        var s = win.getComputedStyle(q('.row', doc));
        return [
          ['.row uses display: flex', s.display === 'flex'],
          ['Items are spaced with justify-content: space-between', s.justifyContent === 'space-between'],
          ['Wrapping is allowed (flex-wrap: wrap)', s.flexWrap === 'wrap'],
          ['There is a gap between items', parseFloat(s.columnGap) > 0]
        ];
      }
    },
    {
      id: 'ex-css-grid', track: 'css', kind: 'css', edit: 'css', lesson: 'css-grid', title: 'Build a grid',
      task: 'Make .grid a grid with three equal columns and a gap.',
      hint: 'grid-template-columns: repeat(3, 1fr); gap: 1rem;',
      starter: { html: '<div class="grid">\n  <div>1</div><div>2</div><div>3</div>\n  <div>4</div><div>5</div><div>6</div>\n</div>', css: '.grid div { background: #e5ddff; padding: 1rem; }\n.grid {\n  /* your grid here */\n}' },
      solution: '.grid div { background: #e5ddff; padding: 1rem; }\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}',
      checks: function (doc, win) {
        var s = win.getComputedStyle(q('.grid', doc));
        var cols = (s.gridTemplateColumns || '').split(' ').filter(Boolean);
        var equal = cols.length === 3 && cols.every(function (c) { return Math.abs(parseFloat(c) - parseFloat(cols[0])) < 1; });
        return [
          ['.grid uses display: grid', s.display === 'grid'],
          ['There are three columns', cols.length === 3],
          ['The columns have equal width', equal],
          ['There is a gap', parseFloat(s.rowGap) > 0]
        ];
      }
    },

    /* ---------- JavaScript ---------- */
    {
      id: 'ex-js-double', track: 'js', kind: 'js', edit: 'js', lesson: 'js-functions', title: 'Write a function',
      task: 'Finish the function double(n) so it returns n multiplied by 2.',
      hint: 'Use return: return n * 2;',
      starter: { html: '', css: '', js: 'function double(n) {\n  // return the doubled number\n}' },
      solution: 'function double(n) {\n  return n * 2;\n}',
      tests: [
        { label: 'double(4) is 8', expr: 'double(4)', expect: 8 },
        { label: 'double(0) is 0', expr: 'double(0)', expect: 0 },
        { label: 'double(-3) is -6', expr: 'double(-3)', expect: -6 }
      ]
    },
    {
      id: 'ex-js-fizz', track: 'js', kind: 'js', edit: 'js', lesson: 'js-conditions-loops', title: 'Fizz and Buzz',
      task: 'Finish fizz(n): return "Fizz" if n divides by 3, "Buzz" if it divides by 5, "FizzBuzz" if both, otherwise the number as a string.',
      hint: 'Check the "both" case first (n % 15 === 0), then 3, then 5.',
      starter: { html: '', css: '', js: 'function fizz(n) {\n  // your code\n}' },
      solution: 'function fizz(n) {\n  if (n % 15 === 0) return "FizzBuzz";\n  if (n % 3 === 0) return "Fizz";\n  if (n % 5 === 0) return "Buzz";\n  return String(n);\n}',
      tests: [
        { label: 'fizz(3) is "Fizz"', expr: 'fizz(3)', expect: 'Fizz' },
        { label: 'fizz(5) is "Buzz"', expr: 'fizz(5)', expect: 'Buzz' },
        { label: 'fizz(15) is "FizzBuzz"', expr: 'fizz(15)', expect: 'FizzBuzz' },
        { label: 'fizz(7) is "7"', expr: 'fizz(7)', expect: '7' }
      ]
    },
    {
      id: 'ex-js-filter', track: 'js', kind: 'js', edit: 'js', lesson: 'js-arrays-objects', title: 'Filter an array',
      task: 'Finish over10(numbers) so it returns a new array with only the numbers greater than 10.',
      hint: 'numbers.filter((n) => n > 10)',
      starter: { html: '', css: '', js: 'function over10(numbers) {\n  // return a new array\n}' },
      solution: 'function over10(numbers) {\n  return numbers.filter((n) => n > 10);\n}',
      tests: [
        { label: 'over10([4, 12, 7, 20, 15]) is [12, 20, 15]', expr: 'over10([4, 12, 7, 20, 15])', expect: [12, 20, 15] },
        { label: 'over10([1, 2]) is []', expr: 'over10([1, 2])', expect: [] },
        { label: 'over10 does not change the original array', expr: '(function(){ var a=[11,5]; over10(a); return a; })()', expect: [11, 5] }
      ]
    },
    {
      id: 'ex-js-total', track: 'js', kind: 'js', edit: 'js', lesson: 'js-arrays-objects', title: 'Add up with reduce',
      task: 'Finish total(items) so it returns the sum of the price of every item. Each item looks like { name: "Pen", price: 2.5 }.',
      hint: 'items.reduce((sum, item) => sum + item.price, 0)',
      starter: { html: '', css: '', js: 'function total(items) {\n  // your code\n}' },
      solution: 'function total(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
      tests: [
        { label: 'total of two items is 6', expr: 'total([{name:"Pen",price:2.5},{name:"Book",price:3.5}])', expect: 6 },
        { label: 'total of an empty list is 0', expr: 'total([])', expect: 0 }
      ]
    },
    {
      id: 'ex-js-dom', track: 'js', kind: 'js', edit: 'js', lesson: 'js-dom', title: 'Change the page',
      task: 'Use the DOM to change the text of the paragraph with id "msg" to exactly: Updated by JavaScript',
      hint: 'document.querySelector("#msg").textContent = "Updated by JavaScript";',
      starter: { html: '<p id="msg">Original text</p>', css: '', js: '// select #msg and change its text\n' },
      solution: 'document.querySelector("#msg").textContent = "Updated by JavaScript";',
      tests: [
        { label: 'The paragraph says "Updated by JavaScript"', expr: 'document.querySelector("#msg").textContent', expect: 'Updated by JavaScript' }
      ]
    },
    {
      id: 'ex-js-click', track: 'js', kind: 'js', edit: 'js', lesson: 'js-events', title: 'Respond to a click',
      task: 'Add a click listener to #btn so that clicking it puts the text "Thanks!" into #out.',
      hint: 'btn.addEventListener("click", () => { out.textContent = "Thanks!"; });',
      starter: { html: '<button id="btn" type="button">Press me</button>\n<p id="out"></p>', css: '', js: '// add a click listener\n' },
      solution: 'document.querySelector("#btn").addEventListener("click", () => {\n  document.querySelector("#out").textContent = "Thanks!";\n});',
      tests: [
        { label: 'Before clicking, #out is empty', expr: 'document.querySelector("#out").textContent', expect: '' },
        { label: 'After a click, #out says "Thanks!"', expr: '(function(){ document.querySelector("#btn").click(); return document.querySelector("#out").textContent; })()', expect: 'Thanks!' }
      ]
    }
  ];

  /* ---------- Quizzes ---------- */
  CP.quizzes = [
    {
      id: 'tools', title: 'Web foundations and workflow', blurb: 'How the web works, paths, DevTools and Git.',
      questions: [
        { q: 'When you open a web address, what does the browser first do?', options: ['Sends a request to a server', 'Writes the HTML itself', 'Deletes its cache', 'Starts a database'], answer: 0, why: 'The browser (client) sends a request. The server answers with a response, usually an HTML file.', lesson: 'how-the-web-works' },
        { q: 'You are in css/style.css and want an image in the images folder next to css. Which path is right?', options: ['images/me.png', '../images/me.png', '/css/images/me.png', 'C:\\images\\me.png'], answer: 1, why: '../ goes up one folder (out of css), then images/me.png goes into the images folder.', lesson: 'files-paths-urls' },
        { q: 'Which DevTools panel is best for finding a file that failed to load (404)?', options: ['Elements', 'Network', 'Application', 'Lighthouse'], answer: 1, why: 'The Network panel lists every request with its status, so a 404 is easy to spot.', lesson: 'debugging' },
        { q: 'What does git commit do?', options: ['Uploads the project to GitHub', 'Saves a snapshot of the changes you staged', 'Deletes the last version', 'Starts a web server'], answer: 1, why: 'A commit saves a snapshot of staged changes in your local repository. Pushing is a separate step that sends commits to GitHub.', lesson: 'git-basics' },
        { q: 'Service workers (used for offline sites) need which kind of address?', options: ['Any file:// path', 'HTTPS or localhost', 'Only .com addresses', 'Only mobile sites'], answer: 1, why: 'Service workers only work in a secure context: HTTPS, or localhost for development.', lesson: 'github-pages' }
      ]
    },
    {
      id: 'html', title: 'HTML5', blurb: 'Structure, links, images, tables and forms.',
      questions: [
        { q: 'Which element holds the main, unique content of a page?', options: ['<section>', '<div>', '<main>', '<aside>'], answer: 2, why: '<main> marks the main content, and a page should have only one visible main element.', lesson: 'html-structure' },
        { q: 'What alt text should a purely decorative image have?', options: ['alt="image"', 'alt="" (empty)', 'No alt attribute at all', 'The file name'], answer: 1, why: 'An empty alt tells screen readers to skip the image. Leaving alt out entirely is a mistake because some readers announce the file name.', lesson: 'html-images-lists' },
        { q: 'Which link text is best?', options: ['Click here', 'Read the lesson on HTML forms', 'Link', 'http://example.com/forms'], answer: 1, why: 'Link text should make sense on its own, because screen reader users often hear a list of links.', lesson: 'html-text-links' },
        { q: 'How do you connect a <label> to an <input>?', options: ['Put them on the same line', 'Match the label\'s for with the input\'s id', 'Give both the same class', 'Use the title attribute'], answer: 1, why: 'for="email" on the label and id="email" on the input link them, so tapping the label focuses the input.', lesson: 'html-forms' },
        { q: 'Which is a good heading practice?', options: ['Pick heading levels for their size', 'Skip from h1 to h5 for a smaller look', 'Keep headings in order and use CSS for size', 'Use bold paragraphs instead of headings'], answer: 2, why: 'Headings form an outline. Use CSS to change how big they look.', lesson: 'html-structure' },
        { q: 'When should you use a <table>?', options: ['To lay out the whole page', 'To show data in rows and columns', 'To make columns on phones', 'To add space'], answer: 1, why: 'Tables are for tabular data. Layout is the job of CSS.', lesson: 'html-tables' }
      ]
    },
    {
      id: 'css', title: 'CSS3', blurb: 'Selectors, the box model, layout and responsive design.',
      questions: [
        { q: 'A paragraph matches both "p { color: red; }" and ".note { color: blue; }". What colour is it if it has class "note"?', options: ['Red', 'Blue', 'Purple', 'It depends on file size'], answer: 1, why: 'A class selector is more specific than a tag selector, so it wins.', lesson: 'css-selectors' },
        { q: 'What does box-sizing: border-box do?', options: ['Adds a border to every element', 'Makes width include padding and border', 'Hides overflow', 'Centres the box'], answer: 1, why: 'With border-box, the width you set includes padding and border, which makes sizing easier to predict.', lesson: 'css-box-model' },
        { q: 'Which media query is mobile-first for "from 700px wide upwards"?', options: ['@media (max-width: 700px)', '@media (min-width: 700px)', '@media (width: 700px)', '@media phone'], answer: 1, why: 'Mobile-first CSS writes the phone styles by default and uses min-width queries to add changes for larger screens.', lesson: 'css-responsive' },
        { q: 'What does 1fr mean in grid-template-columns?', options: ['One fixed pixel', 'One share of the free space', 'One full row', 'One font size'], answer: 1, why: 'fr is a fraction of the available space: "1fr 2fr" gives the second column twice the width.', lesson: 'css-grid' },
        { q: 'WCAG 2.2 level AA asks for what minimum contrast ratio for normal-size text?', options: ['2:1', '3:1', '4.5:1', '10:1'], answer: 2, why: 'Normal text needs 4.5:1 and large text 3:1 at level AA.', lesson: 'css-text-color' },
        { q: 'Which layout tool is designed for one direction at a time (a row or a column)?', options: ['Flexbox', 'Floats', 'Tables', 'Grid only'], answer: 0, why: 'Flexbox is one-dimensional. Grid handles rows and columns together.', lesson: 'css-flexbox' }
      ]
    },
    {
      id: 'js', title: 'JavaScript', blurb: 'Variables, arrays, the DOM, storage and fetch.',
      questions: [
        { q: 'What happens with: const x = 5; x = 6;', options: ['x becomes 6', 'A TypeError is thrown', 'x stays 5 silently', 'x becomes "6"'], answer: 1, why: 'A const variable cannot be reassigned, so JavaScript throws "Assignment to constant variable".', lesson: 'js-variables' },
        { q: 'What is the result of "5" + 3 ?', options: ['8', '"53"', 'NaN', 'An error'], answer: 1, why: 'With a string on one side, + joins text. The result is the string "53".', lesson: 'js-variables' },
        { q: 'Which array method returns a NEW array with every item transformed?', options: ['forEach', 'filter', 'map', 'reduce'], answer: 2, why: 'map applies a function to each item and returns a new array. filter keeps some items; reduce combines them to one value.', lesson: 'js-arrays-objects' },
        { q: 'What is the safest way to show text typed by a user on the page?', options: ['element.innerHTML = text', 'element.textContent = text', 'document.write(text)', 'eval(text)'], answer: 1, why: 'textContent treats the value as plain text, so it cannot inject HTML or scripts.', lesson: 'js-dom' },
        { q: 'localStorage can store…', options: ['Only strings', 'Objects directly', 'Any file', 'Passwords securely'], answer: 0, why: 'Values are strings. Use JSON.stringify to save objects. It is not a safe place for secrets.', lesson: 'js-json-storage' },
        { q: 'fetch() gets a 404 reply from a server. What happens?', options: ['The promise rejects', 'The promise resolves and response.ok is false', 'The page reloads', 'Nothing is returned'], answer: 1, why: 'fetch only rejects for network failures. For HTTP errors you must check response.ok.', lesson: 'js-async-fetch' }
      ]
    }
  ];
})();
