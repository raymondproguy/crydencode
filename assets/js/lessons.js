/* Lessons, part 1: Stages 1 to 3 (foundations, HTML, CSS). Part 2 is lessons-2.js.
   Shape: id, stage, track, level, minutes, title, objectives[], explain[], syntax{lang,code}, example{lang,code,output},
   mistakes[], note{type,text}, exercise{task, starter{html,css,js}}, docs[{label,url}]. Backticks in text make <code>. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  CP.lessons = CP.lessons || [];
  var MDN = 'https://developer.mozilla.org/en-US/docs/';

  function add(l) { CP.lessons.push(l); }

  /* ---------------- Stage 1: Web foundations ---------------- */
  add({
    id: 'how-the-web-works', stage: 1, track: 'basics', level: 'Beginner', minutes: 15,
    title: 'How websites and browsers work',
    objectives: ['Describe the request and response between a browser and a server.', 'Tell client-side code from server-side code.', 'Name the three languages of the front end.'],
    explain: [
      'A website is a set of files stored on a computer called a server. When you type an address or tap a link, your browser (the client) sends a request asking for a file. The server sends back a response, usually an HTML file.',
      'The browser reads the HTML and finds that it needs more files, such as CSS for style and JavaScript for behaviour. It asks for those too, then puts everything together on the screen. This is called rendering.',
      'Code that runs in the browser is client-side (HTML, CSS and JavaScript). Code that runs on the server, for example to look something up in a database, is server-side. This platform teaches the client side first, because you can see the result straight away.'
    ],
    figure: { src: 'assets/images/diagram-request.svg', alt: 'A browser sends a request to a server and the server sends back HTML, CSS and JavaScript files.' },
    syntax: { lang: 'text', code: 'GET /index.html  →  server  →  200 OK + the file' },
    example: { lang: 'html', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>My first page</title>\n</head>\n<body>\n  <h1>Hello, web!</h1>\n</body>\n</html>', output: 'A page whose main heading says "Hello, web!"' },
    mistakes: ['Thinking HTML is a programming language. It describes structure; it does not make decisions.', 'Opening a file from your computer and expecting it to behave like a published site. A file on your device is not on a server yet.'],
    note: { type: 'tip', text: 'HTML gives a page its structure, CSS gives it its look, JavaScript gives it behaviour. Keep that split in mind for the whole course.' },
    exercise: { task: 'Open the editor, change the heading text to your own name and press Run.', starter: { html: '<h1>Hello, web!</h1>\n<p>This page was made by me.</p>', css: '', js: '' } },
    docs: [{ label: 'MDN: HTTP', url: MDN + 'Web/HTTP' }, { label: 'MDN: Learn web development', url: MDN + 'Learn_web_development' }]
  });

  add({
    id: 'files-paths-urls', stage: 1, track: 'basics', level: 'Beginner', minutes: 15,
    title: 'Files, folders, paths and URLs',
    objectives: ['Read the parts of a URL.', 'Write relative paths between files.', 'Explain why file names matter.'],
    explain: [
      'A URL is the address of something on the web. In `https://example.com/lessons/intro.html?id=3#top`, `https` is the protocol, `example.com` is the host, `/lessons/intro.html` is the path, `?id=3` is the query and `#top` is a fragment that jumps to part of the page.',
      'In your own project you link files with paths. `style.css` means "a file next to this one". `images/me.png` means "inside the images folder next to this file". `../style.css` means "go up one folder, then find style.css".',
      'Use lowercase file names with hyphens and no spaces, like `about-me.html`. Many servers treat `About.html` and `about.html` as different files, so a link that works on your laptop can break when published.'
    ],
    syntax: { lang: 'html', code: '<link rel="stylesheet" href="css/style.css">\n<img src="images/me.png" alt="Me smiling">\n<a href="../index.html">Back</a>' },
    example: { lang: 'text', code: 'project/\n├── index.html\n├── about.html\n├── css/\n│   └── style.css\n└── images/\n    └── me.png', output: 'From index.html, the stylesheet path is css/style.css. From css/style.css, the image path is ../images/me.png.' },
    mistakes: ['Using spaces or capital letters in file names.', 'Using a path from your computer, like C:\\Users\\me\\pic.png, in a link. It only works on your machine.'],
    note: { type: 'tip', text: 'If an image or style does not show up, the path is wrong nine times out of ten. Check spelling, capitals and folders.' },
    exercise: { task: 'Add a link that points to a file called about.html in the same folder.', starter: { html: '<h1>Home</h1>\n<!-- add a link to about.html here -->', css: '', js: '' } },
    docs: [{ label: 'MDN: The a element (href and paths)', url: MDN + 'Web/HTML/Element/a' }, { label: 'MDN: Learn web development', url: MDN + 'Learn_web_development' }]
  });

  add({
    id: 'editor-and-devtools', stage: 1, track: 'tools', level: 'Beginner', minutes: 20,
    title: 'Code editors and browser DevTools',
    objectives: ['Choose a beginner-friendly setup.', 'Open DevTools and inspect an element.', 'Read an error in the Console.'],
    explain: [
      'You can write code in any plain text editor. A code editor such as Visual Studio Code adds colours, suggestions and a file list. On a phone or tablet, the editor in this platform is enough to start. Tools change often, so choose one you like and stay with it for a while.',
      'Every desktop browser has DevTools. Open them with F12, or right-click a page and choose Inspect (names can differ between browsers). The Elements panel shows the page structure and the CSS applied. The Console shows errors and messages from JavaScript. The Network panel lists every file the browser requested.',
      'DevTools lets you try changes live. Edits there are temporary and disappear when you reload, so copy anything you want to keep back into your files.'
    ],
    syntax: { lang: 'js', code: 'console.log("Hello from the console");\nconsole.error("Something went wrong");' },
    example: { lang: 'html', code: '<h1>Check the console</h1>\n<script>\n  console.log("The page loaded");\n</script>', output: 'The message "The page loaded" appears in the Console panel, below the preview in this platform\'s editor.' },
    mistakes: ['Ignoring red messages in the Console. They tell you the file and line where something broke.', 'Editing only in DevTools and forgetting to change the real file.'],
    note: { type: 'tip', text: 'The preview page in this platform has a small console. Use console.log to look inside your code while you learn.' },
    exercise: { task: 'Log your name with console.log, then run the code and read the console output.', starter: { html: '<h1>Console practice</h1>', css: '', js: '// write your console.log line below\n' } },
    docs: [{ label: 'Chrome DevTools docs', url: 'https://developer.chrome.com/docs/devtools' }, { label: 'MDN: The console API', url: MDN + 'Web/API/console' }]
  });

  /* ---------------- Stage 2: HTML5 ---------------- */
  add({
    id: 'html-structure', stage: 2, track: 'html', level: 'Beginner', minutes: 20,
    title: 'HTML document structure and semantic elements',
    objectives: ['Write the basic skeleton of an HTML page.', 'Use header, nav, main, section, article and footer.', 'Explain why semantic elements help people and search engines.'],
    explain: [
      'Every HTML page starts with `<!DOCTYPE html>`, then an `<html>` element with a `lang` attribute, a `<head>` for information about the page, and a `<body>` for what people see.',
      'Elements have an opening tag, content and a closing tag: `<p>Hello</p>`. Some elements, like `<img>`, have no content and no closing tag.',
      'Semantic elements describe meaning, not looks. `<header>` is introductory content, `<nav>` holds main navigation links, `<main>` is the unique main content (use it once per page), `<section>` groups related content under a heading, `<article>` is content that makes sense on its own, and `<footer>` closes a page or section. Screen readers use these as landmarks to jump around.'
    ],
    syntax: { lang: 'html', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Page title</title>\n</head>\n<body>\n  <header>…</header>\n  <main>…</main>\n  <footer>…</footer>\n</body>\n</html>' },
    example: { lang: 'html', code: '<header>\n  <h1>My Garden Blog</h1>\n  <nav>\n    <a href="#plants">Plants</a>\n    <a href="#tips">Tips</a>\n  </nav>\n</header>\n<main>\n  <article id="plants">\n    <h2>Growing tomatoes</h2>\n    <p>Tomatoes love sun and water.</p>\n  </article>\n</main>\n<footer><p>Written by me</p></footer>', output: 'A page with a title, two links, one article and a footer.' },
    mistakes: ['Using div for everything when a semantic element exists.', 'Skipping heading levels (jumping from h1 to h4) because of size. Use CSS for size; use heading levels for outline.', 'Forgetting the viewport meta tag, which makes phones show a tiny zoomed-out page.'],
    note: { type: 'a11y', text: 'Use one h1 per page and keep headings in order. Many screen reader users navigate by headings.' },
    exercise: { task: 'Wrap the content in header, main and footer elements.', starter: { html: '<h1>My site</h1>\n<p>Welcome to my site.</p>\n<p>Contact me soon.</p>', css: '', js: '' } },
    docs: [{ label: 'MDN: HTML elements', url: MDN + 'Web/HTML/Element' }, { label: 'MDN: The main element', url: MDN + 'Web/HTML/Element/main' }]
  });

  add({
    id: 'html-text-links', stage: 2, track: 'html', level: 'Beginner', minutes: 20,
    title: 'Headings, paragraphs and links',
    objectives: ['Use h1 to h6 and p correctly.', 'Write links with clear text.', 'Know when to use target and rel.'],
    explain: [
      'Use `<h1>` for the main title and `<h2>` to `<h6>` for sub-sections. Use `<p>` for paragraphs. Browsers add space automatically, so do not press Enter or add empty paragraphs to make space; use CSS.',
      'A link is an `<a>` element with an `href`. The text inside should make sense on its own: "Read the lesson on forms" is better than "click here".',
      'To open a link in a new tab you can add `target="_blank"`. Modern browsers treat that link as if `rel="noopener"` were set, but adding `rel="noopener noreferrer"` is still a clear habit. Use new tabs sparingly because they can confuse some users.'
    ],
    syntax: { lang: 'html', code: '<a href="https://developer.mozilla.org/">MDN Web Docs</a>\n<a href="#contact">Jump to contact</a>\n<a href="mailto:me@example.com">Email me</a>' },
    example: { lang: 'html', code: '<h1>Learning notes</h1>\n<p>Today I read about <a href="lessons.html">HTML lessons</a>.</p>\n<h2 id="contact">Contact</h2>\n<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit example.com</a></p>', output: 'A heading, a paragraph with a link, and a link that opens in a new tab.' },
    mistakes: ['Writing "click here" as link text.', 'Using headings just to make text bigger.', 'Forgetting https:// in an external link, which makes it a relative path.'],
    note: { type: 'a11y', text: 'Screen reader users often listen to a list of all links on a page. Each link should make sense when read alone.' },
    exercise: { task: 'Turn the words "the MDN site" into a link to https://developer.mozilla.org/.', starter: { html: '<h1>Resources</h1>\n<p>I use the MDN site to look things up.</p>', css: '', js: '' } },
    docs: [{ label: 'MDN: The a element', url: MDN + 'Web/HTML/Element/a' }, { label: 'MDN: Heading elements', url: MDN + 'Web/HTML/Element/Heading_Elements' }]
  });

  add({
    id: 'html-images-lists', stage: 2, track: 'html', level: 'Beginner', minutes: 20,
    title: 'Images, alt text and lists',
    objectives: ['Add an image with useful alt text.', 'Decide when alt should be empty.', 'Build ordered and unordered lists.'],
    explain: [
      'The `<img>` element needs `src` (where the file is) and `alt` (a text alternative). Alt text is read by screen readers, shown if the image fails to load, and used by search engines. Describe what the image is for, not "image of".',
      'If an image is only decoration, use an empty alt (`alt=""`) so screen readers skip it. Never leave the alt attribute out. Give `width` and `height` so the page does not jump while the image loads.',
      'Use `<ul>` for lists where order does not matter, `<ol>` for steps, and `<li>` for each item. A list must only contain `li` elements as direct children.'
    ],
    syntax: { lang: 'html', code: '<img src="images/cat.jpg" alt="A grey cat asleep on a sofa" width="400" height="300">\n<ul>\n  <li>Item</li>\n</ul>' },
    example: { lang: 'html', code: '<h2>Study plan</h2>\n<ol>\n  <li>Read the lesson</li>\n  <li>Try the example</li>\n  <li>Take the quiz</li>\n</ol>\n<img src="logo.png" alt="" width="40" height="40">', output: 'A numbered list of three steps. The decorative image is ignored by screen readers.' },
    mistakes: ['Writing alt="image" or the file name.', 'Putting text such as "Photo of" at the start of alt.', 'Using br tags to build a list.'],
    note: { type: 'a11y', text: 'Ask: "If I could not see this image, what would I need to know?" That is your alt text. Text inside an image must also appear in the alt.' },
    exercise: { task: 'Make the three hobbies a bulleted list and give the image meaningful alt text.', starter: { html: '<h1>About me</h1>\n<img src="me.jpg">\nReading\nCoding\nWalking', css: '', js: '' } },
    docs: [{ label: 'MDN: The img element', url: MDN + 'Web/HTML/Element/img' }, { label: 'W3C WAI: Images tutorial', url: 'https://www.w3.org/WAI/tutorials/images/' }]
  });

  add({
    id: 'html-tables', stage: 2, track: 'html', level: 'Beginner', minutes: 15,
    title: 'Tables for data',
    objectives: ['Use tables only for tabular data.', 'Build a table with caption, thead, tbody and th.', 'Use scope to describe headers.'],
    explain: [
      'A table shows data in rows and columns, such as a timetable. Do not use tables to lay out a page; use CSS for that.',
      'Use `<table>`, `<tr>` for each row, `<th>` for header cells and `<td>` for data cells. Add `<caption>` to describe the table, and group rows with `<thead>` and `<tbody>`.',
      'Add `scope="col"` or `scope="row"` on header cells so assistive technology knows which cells a header describes.'
    ],
    syntax: { lang: 'html', code: '<table>\n  <caption>Title</caption>\n  <thead><tr><th scope="col">Name</th></tr></thead>\n  <tbody><tr><td>Value</td></tr></tbody>\n</table>' },
    example: { lang: 'html', code: '<table>\n  <caption>Weekly study time</caption>\n  <thead>\n    <tr><th scope="col">Day</th><th scope="col">Minutes</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">Monday</th><td>30</td></tr>\n    <tr><th scope="row">Tuesday</th><td>45</td></tr>\n  </tbody>\n</table>', output: 'A two-column table with a caption and two data rows.' },
    mistakes: ['Using a table to place things on the page.', 'Using td for headings instead of th.', 'Leaving out the caption.'],
    note: { type: 'a11y', text: 'On narrow screens a wide table may need to scroll sideways. Wrap it in a container with overflow-x: auto.' },
    exercise: { task: 'Add a caption and make the first row into header cells.', starter: { html: '<table>\n  <tr><td>Fruit</td><td>Colour</td></tr>\n  <tr><td>Banana</td><td>Yellow</td></tr>\n</table>', css: 'td, th { border: 1px solid #888; padding: 6px; }', js: '' } },
    docs: [{ label: 'MDN: The caption element', url: MDN + 'Web/HTML/Element/caption' }, { label: 'MDN: The table element', url: MDN + 'Web/HTML/Element/table' }]
  });

  add({
    id: 'html-forms', stage: 2, track: 'html', level: 'Intermediate', minutes: 30,
    title: 'Forms, input types and validation',
    objectives: ['Build a form with labels.', 'Choose suitable input types.', 'Use built-in validation attributes.'],
    explain: [
      'A form collects information. Each control needs a `<label>` linked to it, either with `for` matching the input\'s `id`, or by wrapping the input. Labels make controls understandable to screen readers and give phones a bigger tap area.',
      'The `type` attribute gives the right keyboard and checks. Common types are `text`, `email`, `password`, `number`, `date`, `checkbox`, `radio` and `tel`. Use `<select>` for a list of options and `<textarea>` for long text.',
      'Built-in validation works with no JavaScript: `required`, `minlength`, `maxlength`, `min`, `max` and `pattern`. The browser stops the submit and shows a message. Always validate again on the server in a real site, because users can bypass browser checks.'
    ],
    syntax: { lang: 'html', code: '<label for="email">Email</label>\n<input id="email" name="email" type="email" required>' },
    example: { lang: 'html', code: '<form>\n  <label for="name">Name</label>\n  <input id="name" name="name" type="text" required minlength="2">\n\n  <label for="age">Age</label>\n  <input id="age" name="age" type="number" min="5" max="120">\n\n  <fieldset>\n    <legend>Level</legend>\n    <label><input type="radio" name="level" value="beginner" checked> Beginner</label>\n    <label><input type="radio" name="level" value="other"> Other</label>\n  </fieldset>\n\n  <button type="submit">Send</button>\n</form>', output: 'A form that will not submit until the name has at least two letters.' },
    mistakes: ['Using placeholder text instead of a label. Placeholders disappear and are not a replacement.', 'Forgetting the name attribute, so the value is not sent.', 'Trusting only browser validation.'],
    note: { type: 'security', text: 'Never trust form input. Treat anything a user types as untrusted, and never insert it into a page as HTML. You will see how to do this safely in the JavaScript lessons.' },
    exercise: { task: 'Add a labelled email field that is required, and a submit button.', starter: { html: '<form>\n  <!-- add a label and an email input here -->\n</form>', css: 'label, input { display: block; margin: 8px 0; }', js: '' } },
    docs: [{ label: 'MDN: The form element', url: MDN + 'Web/HTML/Element/form' }, { label: 'MDN: The required attribute', url: MDN + 'Web/HTML/Attributes/required' }]
  });

  add({
    id: 'html-a11y-meta', stage: 2, track: 'html', level: 'Intermediate', minutes: 20,
    title: 'Accessible HTML, metadata and basic SEO',
    objectives: ['Set the page language and title.', 'Write a good meta description.', 'Use basic checks for accessibility.'],
    explain: [
      'Accessible pages work for people who use screen readers, keyboards, voice control or zoom. Good HTML gets you most of the way: real buttons, real links, labels, headings in order, alt text and a `lang` attribute.',
      'The `<title>` is shown in browser tabs and search results. Make it specific and different on every page. A `<meta name="description" content="…">` gives search engines a short summary. Search engines may use or ignore it.',
      'WCAG 2.2 is the current W3C recommendation for accessibility (published in October 2023). It is organised around four ideas: content must be perceivable, operable, understandable and robust. Level AA is the usual target.'
    ],
    syntax: { lang: 'html', code: '<html lang="en">\n<head>\n  <title>Forms lesson | CrydenCode</title>\n  <meta name="description" content="Learn how to build accessible HTML forms.">\n</head>' },
    example: { lang: 'html', code: '<button type="button">Open menu</button>\n<!-- A real button works with keyboard and screen readers. -->\n<div onclick="openMenu()">Open menu</div>\n<!-- A div does not. Avoid this. -->', output: 'The button can be reached with Tab and activated with Enter or Space. The div cannot.' },
    mistakes: ['Using div or span instead of button or a.', 'Removing the focus outline without adding another.', 'Same title on every page.'],
    note: { type: 'a11y', text: 'Test with the keyboard: press Tab through your page. You should always see where focus is and be able to reach every control.' },
    exercise: { task: 'Add lang, a title, and a meta description to this page, and replace the clickable div with a button.', starter: { html: '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n  <div class="btn">Save</div>\n</body>\n</html>', css: '', js: '' } },
    docs: [{ label: 'WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/' }, { label: 'MDN: Accessibility', url: MDN + 'Web/Accessibility' }]
  });

  /* ---------------- Stage 3: CSS3 ---------------- */
  add({
    id: 'css-selectors', stage: 3, track: 'css', level: 'Beginner', minutes: 25,
    title: 'Selectors, the cascade and specificity',
    objectives: ['Select elements by tag, class and id.', 'Explain inheritance and the cascade.', 'Predict which rule wins.'],
    explain: [
      'A CSS rule has a selector and declarations: `p { color: navy; }`. Selectors can match a tag (`p`), a class (`.note`), an id (`#top`), an attribute (`[type="email"]`), or a state (`a:hover`, `button:focus-visible`).',
      'Cascade means rules can overlap. The browser picks a winner using importance, then specificity, then order. Specificity from low to high: tag selectors, then classes, then ids, then inline styles. If two rules are equally specific, the later one wins.',
      'Some properties, like `color` and `font-family`, are inherited from parent to child. Properties like `border` and `margin` are not. Prefer classes for styling: they are reusable and keep specificity low and predictable.'
    ],
    syntax: { lang: 'css', code: 'selector {\n  property: value;\n}\n\n.card { padding: 1rem; }\n.card h2 { margin: 0; }\na:hover { text-decoration: underline; }' },
    example: { lang: 'css', code: 'p { color: #333; }\n.lead { color: #6a47f2; font-size: 1.25rem; }\n#special { color: crimson; }', output: 'A paragraph with class "lead" is violet. If it also has id "special" it would be crimson, because an id is more specific.' },
    mistakes: ['Using !important to fix a specificity problem.', 'Styling with ids everywhere.', 'Forgetting that a later rule can override an earlier one.'],
    note: { type: 'tip', text: 'In DevTools, the Styles pane shows crossed-out rules that lost the cascade. It is the quickest way to find out why a style is not applied.' },
    exercise: { task: 'Make only the paragraph with class "highlight" have a yellow background.', starter: { html: '<p>Normal text</p>\n<p class="highlight">Important text</p>', css: '/* write your rule here */\n', js: '' } },
    docs: [{ label: 'MDN: CSS selectors', url: MDN + 'Web/CSS/CSS_selectors' }, { label: 'MDN: Specificity', url: MDN + 'Web/CSS/Specificity' }]
  });

  add({
    id: 'css-box-model', stage: 3, track: 'css', level: 'Beginner', minutes: 25,
    title: 'The box model, spacing and sizing',
    objectives: ['Name content, padding, border and margin.', 'Use box-sizing: border-box.', 'Choose between px, rem and %.'],
    explain: [
      'Every element is a rectangular box with four layers: content, padding (space inside the border), border, and margin (space outside).',
      'By default, `width` sets only the content, so padding and border make the box bigger. Add `box-sizing: border-box` so that width includes padding and border. A common starting rule is `*, *::before, *::after { box-sizing: border-box; }`.',
      'Use `rem` for most sizes: 1rem equals the root font size (16px by default), so layouts follow the reader\'s text-size setting. Use `%` for widths relative to a parent, and `max-width` to stop content getting too wide.'
    ],
    figure: { src: 'assets/images/diagram-box-model.svg', alt: 'Nested boxes labelled margin, border, padding and content.' },
    syntax: { lang: 'css', code: '.box {\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 30rem;\n  padding: 1rem;\n  border: 2px solid #6a47f2;\n  margin: 0 auto;\n}' },
    example: { lang: 'css', code: '.card {\n  max-width: 20rem;\n  margin: 1rem auto;\n  padding: 1rem;\n  border: 1px solid #ccc;\n  border-radius: 12px;\n}', output: 'A card no wider than 20rem, centred, with space inside and rounded corners.' },
    mistakes: ['Using fixed pixel widths that overflow phones.', 'Margin collapse surprises: vertical margins of neighbours can merge into the larger one.', 'Setting height when content should decide it.'],
    note: { type: 'tip', text: 'Prefer min-height to height, so text that grows (zoom, translation) does not overflow its box.' },
    exercise: { task: 'Give the box 1rem padding, a border, rounded corners and centre it with max-width.', starter: { html: '<div class="box">Hello box</div>', css: '.box {\n  background: #eef;\n}', js: '' } },
    docs: [{ label: 'MDN: The CSS box model', url: MDN + 'Web/CSS/CSS_box_model' }, { label: 'MDN: box-sizing', url: MDN + 'Web/CSS/box-sizing' }]
  });

  add({
    id: 'css-text-color', stage: 3, track: 'css', level: 'Beginner', minutes: 20,
    title: 'Colour, typography and contrast',
    objectives: ['Set colours with hex, rgb and hsl.', 'Style text readably.', 'Check colour contrast.'],
    explain: [
      'Colours can be written as names (`navy`), hex (`#6a47f2`), `rgb()` or `hsl()`. HSL (hue, saturation, lightness) is handy because you can make a lighter or darker version by changing only the lightness.',
      'For readable text use `font-family` with fallbacks (a system font stack loads instantly and works offline), `line-height` around 1.5 for body text, and a comfortable line length (about 45 to 75 characters).',
      'Contrast matters: WCAG 2.2 level AA asks for a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Never use colour as the only way to show information, such as red for errors with no text.'
    ],
    syntax: { lang: 'css', code: 'body {\n  font-family: system-ui, sans-serif;\n  line-height: 1.6;\n  color: #1b1f33;\n  background: #ffffff;\n}' },
    example: { lang: 'css', code: 'h1 { font-size: 2rem; }\n.error { color: #b00020; }\n.error::before { content: "Error: "; font-weight: bold; }', output: 'Error text in dark red that also begins with the word "Error:", so colour is not the only signal.' },
    mistakes: ['Light grey text on a white background.', 'Setting font-size in px, which can ignore user settings in some cases.', 'Huge line lengths on desktop.'],
    note: { type: 'a11y', text: 'Use any free contrast checker to test your colour pairs against the WCAG 4.5:1 and 3:1 thresholds.' },
    exercise: { task: 'Set a readable font, line-height and a dark text colour on a light background.', starter: { html: '<h1>Readable text</h1>\n<p>Good typography makes reading easy for everyone.</p>', css: 'body {\n  /* your styles */\n}', js: '' } },
    docs: [{ label: 'MDN: font-family', url: MDN + 'Web/CSS/font-family' }, { label: 'WCAG: Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html' }]
  });

  add({
    id: 'css-flexbox', stage: 3, track: 'css', level: 'Intermediate', minutes: 30,
    title: 'Layout with Flexbox',
    objectives: ['Make a flex container.', 'Align and space items.', 'Wrap items on small screens.'],
    explain: [
      'Flexbox lays items out in one direction, in a row or a column. Add `display: flex` to the parent (the container) and the children (the items) line up.',
      '`justify-content` spaces items along the main axis (the row direction by default). `align-items` aligns them across it. `gap` adds space between items. `flex-wrap: wrap` lets items drop to a new line when there is not enough room.',
      'On the items, `flex: 1` tells them to share the free space equally. Flexbox is ideal for navigation bars, button groups, cards in a row and centring one thing.'
    ],
    syntax: { lang: 'css', code: '.row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  justify-content: space-between;\n  align-items: center;\n}' },
    example: { lang: 'html', code: '<div class="row">\n  <div class="item">One</div>\n  <div class="item">Two</div>\n  <div class="item">Three</div>\n</div>\n<style>\n  .row { display: flex; flex-wrap: wrap; gap: 1rem; }\n  .item { flex: 1 1 8rem; background: #e5ddff; padding: 1rem; border-radius: 8px; }\n</style>', output: 'Three boxes in a row. On a narrow screen they wrap onto separate lines.' },
    mistakes: ['Putting display: flex on the items instead of the container.', 'Forgetting flex-wrap, so items squash on phones.', 'Using margins to centre when align-items does it.'],
    note: { type: 'tip', text: 'To centre something both ways: display: grid; place-items: center on the parent. Flexbox: justify-content and align-items both center.' },
    exercise: { task: 'Make the three boxes sit in a row with space between them, wrapping if needed.', starter: { html: '<div class="row">\n  <div class="box">1</div>\n  <div class="box">2</div>\n  <div class="box">3</div>\n</div>', css: '.box { background: #e5ddff; padding: 1rem; }\n.row {\n  /* add your layout here */\n}', js: '' } },
    docs: [{ label: 'MDN: The flex property', url: MDN + 'Web/CSS/flex' }, { label: 'MDN: Flexible box layout', url: MDN + 'Web/CSS/CSS_flexible_box_layout' }]
  });

  add({
    id: 'css-grid', stage: 3, track: 'css', level: 'Intermediate', minutes: 30,
    title: 'Layout with CSS Grid',
    objectives: ['Define columns with grid-template-columns.', 'Use fr units and repeat().', 'Make a responsive grid without media queries.'],
    explain: [
      'Grid lays items out in rows and columns at the same time. Add `display: grid` to a container and define columns with `grid-template-columns`.',
      'The `fr` unit means a share of the free space: `1fr 2fr` makes the second column twice as wide. `repeat(3, 1fr)` makes three equal columns. `gap` sets space between cells.',
      'A popular pattern makes a grid that adapts without media queries: `grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr))`. Each column is at least 14rem and the browser fits as many as it can.'
    ],
    syntax: { lang: 'css', code: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));\n  gap: 1rem;\n}' },
    example: { lang: 'css', code: '.page {\n  display: grid;\n  grid-template-columns: 1fr;\n}\n@media (min-width: 48rem) {\n  .page { grid-template-columns: 14rem 1fr; }\n}', output: 'One column on phones. A sidebar and main area from tablet width up.' },
    mistakes: ['Using Grid when a simple row (Flexbox) is enough.', 'Forgetting gap and adding margins to every item.', 'Fixed column widths that overflow phones.'],
    note: { type: 'tip', text: 'Flexbox is one dimension (a row or a column). Grid is two dimensions. Both can live in the same page.' },
    exercise: { task: 'Make the six cards fill a responsive grid with at least 10rem per column.', starter: { html: '<div class="grid">\n  <div class="card">1</div><div class="card">2</div><div class="card">3</div>\n  <div class="card">4</div><div class="card">5</div><div class="card">6</div>\n</div>', css: '.card { background: #e5ddff; padding: 1rem; border-radius: 8px; }\n.grid {\n  /* your grid here */\n}', js: '' } },
    docs: [{ label: 'MDN: grid-template-columns', url: MDN + 'Web/CSS/grid-template-columns' }, { label: 'MDN: CSS grid layout', url: MDN + 'Web/CSS/CSS_grid_layout' }]
  });

  add({
    id: 'css-responsive', stage: 3, track: 'css', level: 'Intermediate', minutes: 25,
    title: 'Responsive, mobile-first design',
    objectives: ['Use the viewport meta tag.', 'Write mobile-first media queries.', 'Make images flexible.'],
    explain: [
      'Responsive design means one page that works on any screen. Start with the phone layout (mobile-first), then add rules for larger screens.',
      'First, add `<meta name="viewport" content="width=device-width, initial-scale=1">` to the head. Without it, phones pretend to be wide desktops.',
      'A media query applies rules only when a condition is true. Using `min-width` in a mobile-first approach means "from this width up". Choose breakpoints where your design starts to look bad, not for specific devices. Make images flexible with `img { max-width: 100%; height: auto; }`.'
    ],
    syntax: { lang: 'css', code: '/* phone styles first */\n.cards { display: grid; gap: 1rem; }\n\n/* from 700px wide upwards */\n@media (min-width: 700px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}' },
    example: { lang: 'css', code: 'img { max-width: 100%; height: auto; }\n@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important; transition: none !important; }\n}', output: 'Images never overflow their container, and motion is turned off for people who asked their device to reduce it.' },
    mistakes: ['Writing desktop CSS first and undoing it for phones.', 'Hiding important content on mobile.', 'Disabling zoom.'],
    note: { type: 'a11y', text: 'Respect user preferences: prefers-reduced-motion and prefers-color-scheme are media features that let your page follow device settings.' },
    exercise: { task: 'Make the layout one column by default and two columns from 600px wide.', starter: { html: '<div class="wrap">\n  <div class="col">A</div>\n  <div class="col">B</div>\n</div>', css: '.col { background: #e5ddff; padding: 1rem; margin: 0.5rem 0; }\n.wrap {\n  /* mobile first, then a media query */\n}', js: '' } },
    docs: [{ label: 'MDN: Viewport meta tag', url: MDN + 'Web/HTML/Viewport_meta_tag' }, { label: 'MDN: Media queries', url: MDN + 'Web/CSS/CSS_media_queries/Using_media_queries' }]
  });

  add({
    id: 'css-vars-motion', stage: 3, track: 'css', level: 'Intermediate', minutes: 25,
    title: 'Custom properties, transitions and animation',
    objectives: ['Define and use CSS variables.', 'Add a transition to a hover state.', 'Respect reduced motion.'],
    explain: [
      'Custom properties (CSS variables) store a value you reuse: define it with a double-dash name, usually on `:root`, and use it with `var()`. Change the variable and everything that uses it changes, which is how this platform switches between dark and light themes.',
      'A `transition` smoothly changes a property over time when it changes, for example on hover. An `@keyframes` animation can run by itself. Keep motion short and subtle, and animate `opacity` and `transform` where possible because browsers handle those smoothly.',
      'Some people feel unwell from motion. Wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)` or turn it off in a reduce query.'
    ],
    syntax: { lang: 'css', code: ':root { --accent: #6a47f2; }\n.button {\n  background: var(--accent);\n  transition: transform 0.2s ease;\n}\n.button:hover { transform: translateY(-2px); }' },
    example: { lang: 'css', code: '@keyframes fade-in {\n  from { opacity: 0; transform: translateY(8px); }\n  to { opacity: 1; transform: none; }\n}\n@media (prefers-reduced-motion: no-preference) {\n  .card { animation: fade-in 0.4s ease; }\n}', output: 'Cards fade in only for people who have not asked for reduced motion.' },
    mistakes: ['Animating width or top, which can cause jank.', 'Long, flashy animations.', 'Forgetting a fallback value: var(--x, blue).'],
    note: { type: 'a11y', text: 'Avoid content that flashes more than three times per second. It can trigger seizures.' },
    exercise: { task: 'Define a --accent variable and use it for the button background and a hover transition.', starter: { html: '<button class="btn">Hover me</button>', css: '.btn { padding: 0.75rem 1.25rem; color: white; border: 0; border-radius: 8px; }\n', js: '' } },
    docs: [{ label: 'MDN: Custom properties', url: MDN + 'Web/CSS/Using_CSS_custom_properties' }, { label: 'MDN: Using CSS transitions', url: MDN + 'Web/CSS/CSS_transitions/Using_CSS_transitions' }]
  });
})();
