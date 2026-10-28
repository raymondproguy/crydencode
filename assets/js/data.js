/* CrydenCode data: roadmap stages, projects and resource links. Lessons, exercises and quizzes live in their own files. */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});

  CP.LAST_REVIEWED = '27 October 2026';

  /* Study times are rough estimates for a complete beginner studying a little each day. */
  CP.stages = [
    {
      id: 1, title: 'Web foundations', hours: 4, level: 'Stable fundamentals',
      description: 'What a website is, how a browser gets one, and the tools you will use every day.',
      prerequisites: ['None. You only need a phone or computer and a browser.'],
      objectives: ['Explain what happens when you open a web address.', 'Read a file path and a URL.', 'Open browser DevTools and inspect a page.']
    },
    {
      id: 2, title: 'HTML5', hours: 10, level: 'Stable fundamentals',
      description: 'Structure web pages with meaningful elements, links, images, lists, tables and forms.',
      prerequisites: ['Stage 1: Web foundations'],
      objectives: ['Write a valid page with semantic structure.', 'Build a form with labels and validation.', 'Write useful alt text and page metadata.']
    },
    {
      id: 3, title: 'CSS3', hours: 14, level: 'Stable fundamentals',
      description: 'Style and lay out pages that look good on a phone first, then on larger screens.',
      prerequisites: ['Stage 2: HTML5'],
      objectives: ['Use selectors, the cascade and the box model.', 'Lay out with Flexbox and Grid.', 'Make a page responsive with media queries.']
    },
    {
      id: 4, title: 'JavaScript', hours: 24, level: 'Stable fundamentals',
      description: 'Add behaviour: store data, react to clicks, update the page and talk to the network.',
      prerequisites: ['Stage 3: CSS3'],
      objectives: ['Use variables, functions, arrays and objects.', 'Change the page with the DOM and events.', 'Save data and fetch data safely.']
    },
    {
      id: 5, title: 'Developer workflow', hours: 6, level: 'Tools change, ideas last',
      description: 'Save your work with Git, publish it, find bugs and check your pages are accessible.',
      prerequisites: ['Stage 4: JavaScript (the first half is enough to start)'],
      objectives: ['Make commits and a GitHub repository.', 'Debug with the Console and breakpoints.', 'Publish a static site.']
    },
    {
      id: 6, title: 'Real-world projects', hours: 20, level: 'Practice',
      description: 'Combine everything into projects you can show to other people.',
      prerequisites: ['Stages 2 to 4', 'Stage 5 helps for publishing'],
      objectives: ['Plan a small project in steps.', 'Build and finish seven projects.', 'Publish your portfolio.']
    }
  ];

  CP.optionalNext = [
    { title: 'TypeScript', text: 'Adds types to JavaScript to catch mistakes early. Learn it after you are comfortable with plain JavaScript.' },
    { title: 'A front-end framework', text: 'Tools such as React, Vue or Svelte help build large interfaces. They are much easier once the DOM and events make sense.' },
    { title: 'Back-end basics', text: 'Servers, databases and APIs of your own. Start when you want to save data for many people, not only one browser.' }
  ];

  CP.projects = [
    {
      id: 'profile-card', title: 'Personal profile card', level: 'Beginner', minutes: 90, track: 'html', stage: 6,
      summary: 'A small card with your photo area, name, short bio and a link, built with HTML and styled with CSS.',
      skills: ['Semantic HTML', 'Box model', 'Colour and type'],
      requirements: ['A heading with your name and a short paragraph about you.', 'An image with meaningful alt text (or a decorative one with empty alt).', 'At least one working link.', 'A card with padding, rounded corners and a readable colour contrast.', 'It looks fine at 320px wide.'],
      steps: ['Write the HTML first, with no styling.', 'Wrap the content in an element with class "card".', 'Add padding, a border or shadow, and a max-width.', 'Centre the card on the page.', 'Test it in the preview at the phone width.'],
      hints: ['Use margin: 0 auto together with max-width to centre a block.', 'Text should stay readable. Try a darker text colour on a light card.'],
      checklist: ['HTML has one h1 and uses sensible elements', 'Image has the correct alt text', 'Link opens the right place', 'Card is styled with CSS', 'Checked at phone width'],
      stretch: ['Add a hover style on the link.', 'Add a dark colour scheme using custom properties.'],
      lessons: ['html-structure', 'html-images-lists', 'css-box-model'],
      starter: { html: '<main class="card">\n  <h1>Your name</h1>\n  <p>One or two sentences about you.</p>\n  <a href="https://developer.mozilla.org/">A link you like</a>\n</main>', css: 'body { font-family: system-ui, sans-serif; background: #eef0f9; padding: 1rem; }\n.card { max-width: 24rem; margin: 0 auto; background: white; padding: 1.5rem; border-radius: 1rem; }', js: '' }
    },
    {
      id: 'landing-page', title: 'Responsive landing page', level: 'Beginner', minutes: 150, track: 'css', stage: 6,
      summary: 'A one-page site for an idea you like (a bakery, a club, a small app) that rearranges itself on bigger screens.',
      skills: ['Flexbox or Grid', 'Media queries', 'Mobile-first CSS'],
      requirements: ['Uses header, main, section and footer elements.', 'Has a hero section with a heading and a call-to-action link.', 'Three feature blocks that stack on phones and sit side by side from about 700px.', 'Includes the viewport meta tag.', 'All text has good contrast and can be zoomed to 200%.'],
      steps: ['Sketch the sections on paper.', 'Write the HTML for every section.', 'Style for a phone width first.', 'Add one media query for wider screens.', 'Test with the browser zoomed in.'],
      hints: ['display: grid with grid-template-columns: repeat(3, 1fr) inside a media query is a quick way to make three columns.', 'Use rem units for spacing so text size settings are respected.'],
      checklist: ['Semantic sections used', 'Viewport meta tag present', 'Phone layout looks right', 'Wide layout looks right', 'Text zoomed to 200% is still usable'],
      stretch: ['Add a sticky header.', 'Add a simple CSS-only hover animation on the buttons.'],
      lessons: ['css-flexbox', 'css-grid', 'css-responsive'],
      starter: { html: '<header>\n  <h1>My Idea</h1>\n</header>\n<main>\n  <section class="hero">\n    <h2>A short promise</h2>\n    <a class="cta" href="#features">See more</a>\n  </section>\n  <section id="features" class="features">\n    <article>One</article>\n    <article>Two</article>\n    <article>Three</article>\n  </section>\n</main>\n<footer>Made with CrydenCode</footer>', css: 'body { margin: 0; font-family: system-ui, sans-serif; }\n.features { display: grid; gap: 1rem; padding: 1rem; }\n@media (min-width: 700px) {\n  .features { grid-template-columns: repeat(3, 1fr); }\n}', js: '' }
    },
    {
      id: 'quiz-app', title: 'Interactive quiz', level: 'Intermediate', minutes: 180, track: 'js', stage: 6,
      summary: 'A multiple-choice quiz that shows one question at a time and a final score.',
      skills: ['Arrays and objects', 'DOM updates', 'Events'],
      requirements: ['Questions are stored in an array of objects.', 'One question is shown at a time with a Next button.', 'Selecting an answer shows if it was correct.', 'A final score is shown at the end.', 'A Restart button resets everything.', 'Answer text is added with textContent.'],
      steps: ['Write the question data first.', 'Write a function that shows question number n.', 'Handle the click on an answer.', 'Count the score.', 'Show the result screen.'],
      hints: ['Keep the current question number and score in two variables.', 'Disable the answer buttons after one has been chosen.'],
      checklist: ['Questions stored as data', 'One question at a time', 'Feedback after answering', 'Score calculated by code', 'Restart works'],
      stretch: ['Save the best score in localStorage.', 'Shuffle the questions.'],
      lessons: ['js-arrays-objects', 'js-dom', 'js-events'],
      starter: { html: '<h1>Quiz</h1>\n<p id="question"></p>\n<div id="answers"></div>\n<p id="result" aria-live="polite"></p>\n<button id="next" type="button">Next</button>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; max-width: 30rem; margin: 0 auto; }\nbutton { min-height: 44px; padding: 0 1rem; margin: 0.25rem 0; }', js: 'const questions = [\n  { text: "Which tag makes a link?", options: ["<a>", "<link>", "<url>"], answer: 0 }\n];\nlet index = 0;\nlet score = 0;\n\nfunction showQuestion() {\n  const q = questions[index];\n  document.getElementById("question").textContent = q.text;\n  // build the answer buttons here\n}\nshowQuestion();' }
    },
    {
      id: 'todo-list', title: 'To-do list with saving', level: 'Intermediate', minutes: 180, track: 'js', stage: 6,
      summary: 'Add, complete and delete tasks. The list is still there after you reload the page.',
      skills: ['Forms and events', 'localStorage', 'JSON'],
      requirements: ['A form adds a task and refuses empty text.', 'Each task has a checkbox and a delete button.', 'Tasks are saved with localStorage as JSON.', 'The saved list loads again when the page opens.', 'Broken saved data does not crash the page.', 'Every control has a label or accessible name.'],
      steps: ['Build the form and an empty list in HTML.', 'Keep tasks in an array of objects.', 'Write one render() function that draws the list.', 'Call save() after every change.', 'Load with JSON.parse inside try/catch.'],
      hints: ['Always redraw the whole list from the array. It is simpler than editing single items.', 'Use crypto.randomUUID() or Date.now() for ids.'],
      checklist: ['Add works and ignores empty input', 'Complete toggles', 'Delete works', 'Reload keeps the list', 'Keyboard-only use works'],
      stretch: ['Add a filter for All, Active and Done.', 'Show a count of tasks left.'],
      lessons: ['js-forms-validation', 'js-json-storage', 'js-events'],
      starter: { html: '<h1>Tasks</h1>\n<form id="form">\n  <label for="task">New task</label>\n  <input id="task" type="text" required>\n  <button type="submit">Add</button>\n</form>\n<ul id="list"></ul>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; max-width: 30rem; margin: 0 auto; }\nli { padding: 0.5rem 0; }', js: 'let tasks = [];\nconst list = document.getElementById("list");\n\nfunction render() {\n  list.textContent = "";\n  tasks.forEach((t) => {\n    const li = document.createElement("li");\n    li.textContent = t.text;\n    list.appendChild(li);\n  });\n}\n\ndocument.getElementById("form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const input = document.getElementById("task");\n  const text = input.value.trim();\n  if (!text) return;\n  tasks.push({ id: Date.now(), text: text, done: false });\n  input.value = "";\n  render();\n});' }
    },
    {
      id: 'expense-tracker', title: 'Expense tracker', level: 'Intermediate', minutes: 240, track: 'js', stage: 6,
      summary: 'Record spending with a category and see totals. It starts with sample data you can clear.',
      skills: ['Array methods', 'Number formatting', 'Data and UI together'],
      requirements: ['Starts with a few sample expenses clearly labelled as samples.', 'A form adds an expense with a description, amount and category.', 'Amounts are validated as positive numbers.', 'Shows the total and a total per category using reduce().', 'Uses Intl.NumberFormat for money.', 'Data is saved in localStorage.'],
      steps: ['Define the expense object shape.', 'Render a list from the array.', 'Calculate totals with reduce().', 'Add the form and validation.', 'Save and load.'],
      hints: ['Store amounts as numbers, not text. Convert with Number(value).', 'Number.isFinite() helps catch bad input.'],
      checklist: ['Sample data marked as sample', 'Add with validation', 'Totals are correct', 'Money formatted', 'Saved after reload'],
      stretch: ['Add a delete button.', 'Show a simple bar for each category using CSS widths.'],
      lessons: ['js-arrays-objects', 'js-forms-validation', 'js-json-storage'],
      starter: { html: '<h1>Expenses</h1>\n<p><em>Sample data. Clear it when you start.</em></p>\n<ul id="list"></ul>\n<p>Total: <strong id="total"></strong></p>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; max-width: 30rem; margin: 0 auto; }', js: 'const expenses = [\n  { id: 1, label: "Bus", amount: 3.5, category: "Travel" },\n  { id: 2, label: "Lunch", amount: 7.25, category: "Food" }\n];\nconst money = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });\nconst total = expenses.reduce((sum, e) => sum + e.amount, 0);\ndocument.getElementById("total").textContent = money.format(total);' }
    },
    {
      id: 'weather-dashboard', title: 'Weather dashboard', level: 'Advanced', minutes: 240, track: 'js', stage: 6,
      summary: 'Fetch the current weather for a place from a public API. This project needs an internet connection.',
      skills: ['fetch and async/await', 'Error handling', 'Working with APIs'],
      requirements: ['Uses fetch() with async/await.', 'Shows a loading state, a result state and an error state.', 'Handles network errors and a failed response (response.ok).', 'Does not need an API key (Open-Meteo is free for non-commercial use and asks for attribution).', 'Shows a note when the browser is offline.', 'Credits Open-Meteo.com on the page.'],
      steps: ['Try the API URL in a browser tab first.', 'Write a function getWeather(lat, lon).', 'Show the loading message before the request.', 'Display temperature and wind with textContent.', 'Handle errors in try/catch.'],
      hints: ['The forecast endpoint is https://api.open-meteo.com/v1/forecast with latitude, longitude and current=temperature_2m,wind_speed_10m.', 'Check the field names in the JSON that comes back.'],
      checklist: ['Loading state shown', 'Result shown', 'Error shown when it fails', 'Offline message works', 'Open-Meteo credited'],
      stretch: ['Let the learner pick from a list of cities.', 'Remember the last city in localStorage.'],
      lessons: ['js-async-fetch', 'js-json-storage', 'debugging'],
      needsInternet: true,
      starter: { html: '<h1>Weather</h1>\n<button id="load" type="button">Get weather</button>\n<p id="out" aria-live="polite">Press the button.</p>\n<p><small>Data: <a href="https://open-meteo.com/">Open-Meteo.com</a></small></p>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; max-width: 30rem; margin: 0 auto; }\nbutton { min-height: 44px; padding: 0 1rem; }', js: 'const out = document.getElementById("out");\n\nasync function getWeather(lat, lon) {\n  out.textContent = "Loading...";\n  try {\n    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,wind_speed_10m";\n    const response = await fetch(url);\n    if (!response.ok) throw new Error("Server answered " + response.status);\n    const data = await response.json();\n    out.textContent = data.current.temperature_2m + " °C, wind " + data.current.wind_speed_10m + " km/h";\n  } catch (error) {\n    out.textContent = "Could not load the weather. Are you online?";\n  }\n}\n\ndocument.getElementById("load").addEventListener("click", () => getWeather(52.52, 13.41));' }
    },
    {
      id: 'portfolio', title: 'Complete portfolio website', level: 'Advanced', minutes: 360, track: 'projects', stage: 6,
      summary: 'A multi-section responsive site that shows who you are and what you have built, published online.',
      skills: ['Everything so far', 'Git and GitHub Pages', 'Accessibility checks'],
      requirements: ['Home, About, Projects and Contact sections or pages.', 'Links to at least three of your projects from this platform.', 'Works on phone, tablet and desktop.', 'Passes a keyboard-only check and has visible focus styles.', 'Has a theme or colour scheme using CSS custom properties.', 'Published with GitHub Pages or another static host.'],
      steps: ['Plan the pages and write the content.', 'Build the structure in HTML.', 'Style it mobile-first.', 'Run the accessibility checklist lesson.', 'Commit with Git and publish.'],
      hints: ['Start with plain text content. Design is easier when the words exist.', 'GitHub Pages can take a few minutes to publish after you push.'],
      checklist: ['All sections written', 'Responsive at three widths', 'Keyboard check passed', 'Repository created on GitHub', 'Site published and link tested'],
      stretch: ['Add a dark mode toggle that remembers the choice.', 'Add a short blog page written by you.'],
      lessons: ['plan-a-project', 'git-basics', 'github-pages', 'a11y-checks']
    }
  ];

  /* Every link below was chosen from well-known official sources. "Last reviewed" is shown wherever they are listed. */
  CP.resources = [
    { group: 'Learning paths', items: [
      { title: 'MDN: Learn web development', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development', note: 'Mozilla\'s beginner-to-comfortable guide. The main reference for this roadmap.' },
      { title: 'MDN Curriculum', url: 'https://developer.mozilla.org/en-US/curriculum/', note: 'The list of skills a front-end developer needs, used to check this roadmap.' },
      { title: 'web.dev Learn', url: 'https://web.dev/learn', note: 'Free courses from the Chrome team, including HTML, CSS and JavaScript.' },
      { title: 'javascript.info', url: 'https://javascript.info/', note: 'A long, careful JavaScript tutorial to read after the basics.' }
    ] },
    { group: 'Reference', items: [
      { title: 'MDN: HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', note: 'Every HTML element and attribute.' },
      { title: 'MDN: CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', note: 'Every CSS property, with browser support tables.' },
      { title: 'MDN: JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', note: 'The language and its built-in objects.' },
      { title: 'MDN: Web APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/API', note: 'DOM, Fetch, Web Storage, Service Workers and more.' }
    ] },
    { group: 'Accessibility and security', items: [
      { title: 'WCAG 2.2 (W3C Recommendation)', url: 'https://www.w3.org/TR/WCAG22/', note: 'The current Web Content Accessibility Guidelines, published October 2023.' },
      { title: 'WCAG 2.2 quick reference', url: 'https://www.w3.org/WAI/WCAG22/quickref/', note: 'A filterable checklist of the success criteria.' },
      { title: 'MDN: Accessibility', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility', note: 'Practical guides for building accessible pages.' },
      { title: 'MDN: Web security', url: 'https://developer.mozilla.org/en-US/docs/Web/Security', note: 'How to keep users and data safe.' }
    ] },
    { group: 'Developer workflow', items: [
      { title: 'Pro Git (free book)', url: 'https://git-scm.com/book/en/v2', note: 'The official Git book. Read chapters 1 and 2 first.' },
      { title: 'GitHub Pages quickstart', url: 'https://docs.github.com/en/pages/quickstart', note: 'Publish a static site for free. Check GitHub\'s page for current plan limits.' },
      { title: 'Chrome DevTools documentation', url: 'https://developer.chrome.com/docs/devtools', note: 'Learn the Elements, Console, Network and Sources panels.' },
      { title: 'MDN: Progressive web apps caching guide', url: 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching', note: 'How service workers and the Cache API make offline sites work.' },
      { title: 'web.dev: The Offline Cookbook', url: 'https://web.dev/articles/offline-cookbook', note: 'Patterns for caching, by Jake Archibald.' }
    ] },
    { group: 'Used in projects (needs internet)', items: [
      { title: 'Open-Meteo', url: 'https://open-meteo.com/', note: 'Free weather API with no key for non-commercial use. Data is licensed CC BY 4.0, so credit them.' }
    ] }
  ];

  CP.stableVsChanging = {
    stable: ['How the web, browsers and URLs work', 'HTML elements, forms and semantics', 'The CSS cascade, box model, Flexbox and Grid', 'JavaScript variables, functions, arrays, objects and the DOM', 'Accessibility principles (WCAG 2.2)'],
    changing: ['Which code editor, browser or framework is most popular', 'Exact DevTools menus and button names', 'GitHub plan limits and Pages settings', 'Browser support for the newest CSS and JavaScript features', 'Public API terms (check each provider)']
  };
})();
