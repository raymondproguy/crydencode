/* Lessons, part 2: Stages 4 to 6 (JavaScript, developer workflow, projects). */
(function () {
  'use strict';
  var CP = (window.CP = window.CP || {});
  CP.lessons = CP.lessons || [];
  var MDN = 'https://developer.mozilla.org/en-US/docs/';
  function add(l) { CP.lessons.push(l); }

  /* ---------------- Stage 4: JavaScript ---------------- */
  add({
    id: 'js-variables', stage: 4, track: 'js', level: 'Beginner', minutes: 25,
    title: 'Variables, data types and operators',
    objectives: ['Declare variables with const and let.', 'Recognise strings, numbers, booleans, null and undefined.', 'Use arithmetic, comparison and logical operators.'],
    explain: [
      'A variable is a named box for a value. Use `const` for values that will not be reassigned and `let` for values that will. Avoid `var` in new code because its scope rules surprise beginners.',
      'The basic data types are strings (`"hello"`), numbers (`42`, `3.14`), booleans (`true` or `false`), `null` (empty on purpose) and `undefined` (no value yet). `typeof` tells you the type of a value.',
      'Operators do work: `+ - * / %` for maths, `===` and `!==` to compare without type conversion, and `&&`, `||`, `!` for and, or, not. Prefer `===` to `==`. A template literal with backticks lets you put values in text: `Hello ${name}`.'
    ],
    syntax: { lang: 'js', code: 'const name = "Ada";\nlet score = 0;\nscore = score + 10;\nconsole.log(typeof name, score === 10);' },
    example: { lang: 'js', code: 'const price = 4.5;\nconst quantity = 3;\nconst total = price * quantity;\nconsole.log("Total: " + total);\nconsole.log(0.1 + 0.2);', output: 'Total: 13.5, then 0.30000000000000004. Computers store decimals in binary, so tiny rounding differences are normal.' },
    mistakes: ['Using = when you mean === in a comparison.', 'Reassigning a const (it throws an error).', 'Forgetting that "5" + 3 gives "53" (string joining), not 8.'],
    note: { type: 'tip', text: 'Choose names that say what the value is: totalPrice is better than x. Use camelCase for variable names.' },
    exercise: { task: 'Create const variables for a width and a height, and log their area.', starter: { html: '<p>Open the console below the preview.</p>', css: '', js: '// declare width and height, then log width * height\n' } },
    docs: [{ label: 'MDN: JavaScript Guide', url: MDN + 'Web/JavaScript/Guide' }, { label: 'MDN: Grammar and types', url: MDN + 'Web/JavaScript/Guide/Grammar_and_types' }]
  });

  add({
    id: 'js-conditions-loops', stage: 4, track: 'js', level: 'Beginner', minutes: 25,
    title: 'Conditionals and loops',
    objectives: ['Make decisions with if, else if and else.', 'Repeat work with for and while.', 'Avoid infinite loops.'],
    explain: [
      'A conditional runs code only when a condition is true: `if (score >= 50) { … } else { … }`. Values like `0`, `""`, `null`, `undefined` and `NaN` count as false ("falsy"); most others count as true.',
      'A `for` loop repeats code a set number of times: `for (let i = 0; i < 5; i++) { … }`. A `while` loop repeats as long as a condition stays true. `for…of` loops over each item in an array.',
      'Make sure the loop condition can become false. If it never does, the page freezes. CrydenCode\'s preview stops most loops that run for a long time and shows an error, but other websites will not be so kind.'
    ],
    syntax: { lang: 'js', code: 'if (age >= 18) {\n  console.log("adult");\n} else {\n  console.log("minor");\n}\nfor (let i = 1; i <= 3; i++) {\n  console.log(i);\n}' },
    example: { lang: 'js', code: 'const scores = [40, 75, 90];\nfor (const s of scores) {\n  if (s >= 50) {\n    console.log(s + ": pass");\n  } else {\n    console.log(s + ": try again");\n  }\n}', output: '40: try again, 75: pass, 90: pass' },
    mistakes: ['A loop that never ends.', 'Off-by-one errors (< versus <=).', 'Putting a semicolon right after the if condition.'],
    note: { type: 'tip', text: 'When a loop does something unexpected, console.log the counter inside it to watch what happens each time.' },
    exercise: { task: 'Log the numbers 1 to 5, but write "five!" instead of 5.', starter: { html: '<p>Open the console.</p>', css: '', js: 'for (let i = 1; i <= 5; i++) {\n  // your code\n}' } },
    docs: [{ label: 'MDN: Control flow', url: MDN + 'Web/JavaScript/Guide/Control_flow_and_error_handling' }, { label: 'MDN: Loops and iteration', url: MDN + 'Web/JavaScript/Guide/Loops_and_iteration' }]
  });

  add({
    id: 'js-functions', stage: 4, track: 'js', level: 'Beginner', minutes: 25,
    title: 'Functions and scope',
    objectives: ['Write and call functions.', 'Use parameters and return values.', 'Explain block and function scope.'],
    explain: [
      'A function is a reusable set of steps with a name. It can take inputs (parameters) and give back an output with `return`. A function that does not return gives back `undefined`.',
      'Arrow functions are a short form: `const double = (n) => n * 2;`. Both forms are common, so learn to read both.',
      'Scope decides where a variable can be seen. A variable declared inside a function or `{ }` block with `let` or `const` is not visible outside it. Prefer small functions that do one thing and have clear names, such as `calculateTotal`.'
    ],
    syntax: { lang: 'js', code: 'function add(a, b) {\n  return a + b;\n}\nconst double = (n) => n * 2;\nconsole.log(add(2, 3), double(4));' },
    example: { lang: 'js', code: 'function greet(name = "friend") {\n  return "Hello, " + name + "!";\n}\nconsole.log(greet("Ada"));\nconsole.log(greet());', output: 'Hello, Ada! then Hello, friend!' },
    mistakes: ['Forgetting return and getting undefined.', 'Calling a function without parentheses (greet instead of greet()).', 'Changing global variables from inside functions.'],
    note: { type: 'tip', text: 'If you are copying the same lines three times, make a function.' },
    exercise: { task: 'Write a function named double that returns its argument multiplied by two.', starter: { html: '<p>Open the console.</p>', css: '', js: 'function double(n) {\n  // return the doubled number\n}\nconsole.log(double(4));' } },
    docs: [{ label: 'MDN: Functions guide', url: MDN + 'Web/JavaScript/Guide/Functions' }, { label: 'MDN: Arrow functions', url: MDN + 'Web/JavaScript/Reference/Functions/Arrow_functions' }]
  });

  add({
    id: 'js-arrays-objects', stage: 4, track: 'js', level: 'Intermediate', minutes: 35,
    title: 'Arrays, objects and array methods',
    objectives: ['Store lists in arrays and records in objects.', 'Use map, filter and reduce.', 'Read and update object properties.'],
    explain: [
      'An array is an ordered list: `["a", "b"]`. Use `[0]` for the first item, `.length` for the count, and `.push(x)` to add to the end. An object is a set of named values: `{ title: "Quiz", done: false }`. Read with `task.title` and change with `task.done = true`.',
      'Array methods save writing loops. `map` makes a new array by changing each item. `filter` keeps items that pass a test. `find` returns the first match. `reduce` combines everything into one value, such as a total. `forEach` runs code for each item.',
      'Real data is often an array of objects, such as a list of tasks. Learn to read it comfortably and you can build quizzes, to-do lists and trackers.'
    ],
    syntax: { lang: 'js', code: 'const nums = [1, 2, 3, 4];\nconst doubled = nums.map((n) => n * 2);\nconst even = nums.filter((n) => n % 2 === 0);\nconst sum = nums.reduce((total, n) => total + n, 0);' },
    example: { lang: 'js', code: 'const tasks = [\n  { text: "Read lesson", done: true },\n  { text: "Do quiz", done: false }\n];\nconst todo = tasks.filter((t) => !t.done);\nconsole.log(todo.length + " left");\nconsole.log(todo[0].text);', output: '1 left, then Do quiz' },
    mistakes: ['Expecting map to change the original array (it returns a new one).', 'Forgetting the starting value (0) in reduce.', 'Reading an index that does not exist, which gives undefined.'],
    note: { type: 'tip', text: 'Use console.table(tasks) to print an array of objects as a readable table.' },
    exercise: { task: 'Use filter to keep only the numbers greater than 10, and log the result.', starter: { html: '<p>Open the console.</p>', css: '', js: 'const numbers = [4, 12, 7, 20, 15];\n// log only numbers greater than 10\n' } },
    docs: [{ label: 'MDN: Array', url: MDN + 'Web/JavaScript/Reference/Global_Objects/Array' }, { label: 'MDN: Working with objects', url: MDN + 'Web/JavaScript/Guide/Working_with_objects' }]
  });

  add({
    id: 'js-dom', stage: 4, track: 'js', level: 'Intermediate', minutes: 30,
    title: 'The DOM: selecting and changing the page',
    objectives: ['Explain what the DOM is.', 'Select elements with querySelector.', 'Update text, attributes and classes safely.'],
    explain: [
      'The Document Object Model (DOM) is the browser\'s live tree of objects built from your HTML. JavaScript can read and change that tree, and the page updates straight away.',
      'Pick an element with `document.querySelector("#id")` or `.class` (first match) or `querySelectorAll` (all matches). Change text with `element.textContent`, change an attribute with `setAttribute`, and toggle a style by switching a class with `element.classList.toggle("active")`.',
      'Create new elements with `document.createElement`, set their text, and add them with `append`. Using `textContent` is safe because it treats the value as plain text. Avoid `innerHTML` with anything a user typed.'
    ],
    syntax: { lang: 'js', code: 'const title = document.querySelector("h1");\ntitle.textContent = "New title";\ntitle.classList.add("highlight");' },
    example: { lang: 'html', code: '<ul id="list"></ul>\n<script>\n  const items = ["Learn HTML", "Learn CSS", "Learn JS"];\n  const list = document.querySelector("#list");\n  for (const text of items) {\n    const li = document.createElement("li");\n    li.textContent = text;\n    list.append(li);\n  }\n</script>', output: 'A list of three items built by code.' },
    mistakes: ['Running the script before the element exists (put the script at the end of body or use defer).', 'Using innerHTML with user text.', 'Selecting an element that does not exist and getting null.'],
    note: { type: 'security', text: 'Setting innerHTML with text from a user can run attacker code (cross-site scripting, XSS). Use textContent or create elements instead.' },
    exercise: { task: 'Change the paragraph text to "Updated by JavaScript" using textContent.', starter: { html: '<p id="msg">Original text</p>', css: '', js: '// select #msg and change its text\n' } },
    docs: [{ label: 'MDN: DOM introduction', url: MDN + 'Web/API/Document_Object_Model/Introduction' }, { label: 'MDN: querySelector', url: MDN + 'Web/API/Document/querySelector' }]
  });

  add({
    id: 'js-events', stage: 4, track: 'js', level: 'Intermediate', minutes: 30,
    title: 'Events and event handling',
    objectives: ['Listen for click and input events.', 'Use the event object.', 'Use event delegation.'],
    explain: [
      'Events are things that happen on the page: clicks, key presses, typing, form submits. Attach a listener with `element.addEventListener("click", function)`. The function runs every time that event happens.',
      'The function receives an event object. `event.target` is the element involved. In forms, call `event.preventDefault()` to stop the browser from reloading the page on submit.',
      'Event delegation means putting one listener on a parent to handle clicks from many children, using `event.target.closest("button")`. It works for items you add later, such as new list rows. Use real `<button>` elements so the keyboard works for free.'
    ],
    syntax: { lang: 'js', code: 'button.addEventListener("click", () => {\n  count++;\n  output.textContent = count;\n});' },
    example: { lang: 'html', code: '<button id="b" type="button">Clicked 0 times</button>\n<script>\n  let n = 0;\n  const b = document.querySelector("#b");\n  b.addEventListener("click", () => {\n    n++;\n    b.textContent = "Clicked " + n + " times";\n  });\n</script>', output: 'A button whose label counts your clicks.' },
    mistakes: ['Writing onclick="…" in HTML instead of addEventListener.', 'Calling the function inside addEventListener (fn() instead of fn).', 'Forgetting preventDefault on a form.'],
    note: { type: 'a11y', text: 'Click handlers on div or span elements are not reachable by keyboard. Use button or a.' },
    exercise: { task: 'Make the button show the text "Thanks!" in the paragraph when clicked.', starter: { html: '<button id="btn" type="button">Press me</button>\n<p id="out"></p>', css: '', js: '// add a click listener\n' } },
    docs: [{ label: 'MDN: addEventListener', url: MDN + 'Web/API/EventTarget/addEventListener' }, { label: 'MDN: Event', url: MDN + 'Web/API/Event' }]
  });

  add({
    id: 'js-forms-validation', stage: 4, track: 'js', level: 'Intermediate', minutes: 30,
    title: 'Forms and input validation with JavaScript',
    objectives: ['Read values from a form.', 'Validate before using input.', 'Show helpful error messages.'],
    explain: [
      'Read a field with `input.value` (always a string). Convert to a number with `Number(value)`, then check it with `Number.isFinite()`. Use `value.trim()` to remove spaces from the ends.',
      'Validate early and give clear feedback near the field, such as "Enter a number greater than zero". Set an element with `role="alert"` or `aria-live="polite"` so screen readers announce the message.',
      'Browser validation (`required`, `min`, `type="email"`) is a good first layer. JavaScript checks add custom rules. In a real site the server must check again.'
    ],
    syntax: { lang: 'js', code: 'form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const text = input.value.trim();\n  if (text === "") {\n    error.textContent = "Please type something.";\n    return;\n  }\n  error.textContent = "";\n});' },
    example: { lang: 'html', code: '<form id="f">\n  <label for="n">Amount</label>\n  <input id="n" type="text" inputmode="decimal">\n  <button>Check</button>\n  <p id="msg" aria-live="polite"></p>\n</form>\n<script>\n  document.querySelector("#f").addEventListener("submit", (e) => {\n    e.preventDefault();\n    const value = Number(document.querySelector("#n").value);\n    const ok = Number.isFinite(value) && value > 0;\n    document.querySelector("#msg").textContent = ok ? "Looks good" : "Enter a number above zero";\n  });\n</script>', output: 'Typing 5 shows "Looks good". Typing abc shows the error message.' },
    mistakes: ['Forgetting that input values are strings.', 'Using alert() for errors.', 'Clearing the field before reading its value.'],
    note: { type: 'security', text: 'Validation in the browser is for helping users. It does not protect a server, because anyone can bypass it.' },
    exercise: { task: 'On submit, show "Name is required" if the field is empty, otherwise show "Hello, name".', starter: { html: '<form id="f">\n  <label for="name">Name</label>\n  <input id="name" type="text">\n  <button>Go</button>\n</form>\n<p id="out" aria-live="polite"></p>', css: 'label, input { display: block; margin: 6px 0; }', js: '// your submit handler\n' } },
    docs: [{ label: 'MDN: The required attribute', url: MDN + 'Web/HTML/Attributes/required' }, { label: 'MDN: Number.isFinite', url: MDN + 'Web/JavaScript/Reference/Global_Objects/Number/isFinite' }]
  });

  add({
    id: 'js-json-storage', stage: 4, track: 'js', level: 'Intermediate', minutes: 30,
    title: 'JSON, error handling and localStorage',
    objectives: ['Convert data with JSON.stringify and JSON.parse.', 'Handle errors with try/catch.', 'Save and load with localStorage.'],
    explain: [
      'JSON is a text format for data that looks like JavaScript objects. `JSON.stringify(value)` turns data into text. `JSON.parse(text)` turns it back, and throws an error if the text is not valid.',
      '`localStorage` keeps small pieces of text in the browser, even after you close the page. It only stores strings, so use JSON for lists and objects. It is not private or secure: never store passwords, and remember anyone using this browser profile can read it.',
      'Wrap risky work (parsing, storage access) in `try { … } catch (error) { … }` so a problem does not crash the page. Storage can be full, blocked in private mode, or contain data from an older version of your app.'
    ],
    syntax: { lang: 'js', code: 'function load() {\n  try {\n    const text = localStorage.getItem("tasks");\n    return text ? JSON.parse(text) : [];\n  } catch (error) {\n    return [];\n  }\n}\nfunction save(tasks) {\n  localStorage.setItem("tasks", JSON.stringify(tasks));\n}' },
    example: { lang: 'js', code: 'const note = { text: "Learn JSON", done: false };\nconst text = JSON.stringify(note);\nconsole.log(text);\nconsole.log(JSON.parse(text).text);\ntry {\n  JSON.parse("{ not json");\n} catch (e) {\n  console.log("Caught: bad JSON");\n}', output: '{"text":"Learn JSON","done":false}, Learn JSON, Caught: bad JSON' },
    mistakes: ['Storing an object directly (it becomes "[object Object]").', 'Not catching JSON.parse errors.', 'Storing sensitive information.'],
    note: { type: 'security', text: 'localStorage can be read by any script on the same site. If a site has an XSS bug, stored data can be stolen. Keep it for harmless preferences and progress.' },
    exercise: { task: 'Save an object to localStorage, read it back with JSON.parse and log it. (The preview keeps this practice data separate from your CrydenCode progress.)', starter: { html: '<p>Open the console.</p>', css: '', js: 'const settings = { theme: "dark" };\n// save, then load and log\n' } },
    docs: [{ label: 'MDN: Web Storage API', url: MDN + 'Web/API/Web_Storage_API' }, { label: 'MDN: JSON', url: MDN + 'Web/JavaScript/Reference/Global_Objects/JSON' }]
  });

  add({
    id: 'js-async-fetch', stage: 4, track: 'js', level: 'Advanced', minutes: 35,
    title: 'Promises, async/await and the Fetch API',
    objectives: ['Explain what a Promise is.', 'Use async/await.', 'Fetch JSON and handle failure.'],
    explain: [
      'Some work takes time, such as loading data over the network. A Promise represents a value that will arrive later. Instead of freezing the page, JavaScript carries on and handles the result when it is ready.',
      '`async`/`await` is a clear way to write this. Inside an `async` function, `await` pauses that function until the Promise settles. `fetch(url)` asks for data and returns a Promise of a Response. Call `response.json()` to read JSON.',
      '`fetch` only rejects on network failure. A 404 or 500 reply still counts as a response, so always check `response.ok`. Show three states in the interface: loading, success and error. Public APIs need internet, may change, and some require keys or have rules about use, so read their terms.'
    ],
    syntax: { lang: 'js', code: 'async function load(url) {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error("Status " + response.status);\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n    return null;\n  }\n}' },
    example: { lang: 'js', code: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\nasync function run() {\n  console.log("start");\n  await wait(500);\n  console.log("half a second later");\n}\nrun();', output: 'start, then "half a second later" after a short pause.' },
    mistakes: ['Forgetting await and getting a Promise object.', 'Not checking response.ok.', 'Not handling the offline case.'],
    note: { type: 'tip', text: 'API-powered projects need an internet connection. Check navigator.onLine and show a friendly message when it is false.' },
    exercise: { task: 'Write an async function that waits 300ms and then logs "done".', starter: { html: '<p>Open the console.</p>', css: '', js: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n// write the async function and call it\n' } },
    docs: [{ label: 'MDN: Fetch API', url: MDN + 'Web/API/Fetch_API' }, { label: 'MDN: Using promises', url: MDN + 'Web/JavaScript/Guide/Using_promises' }]
  });

  /* ---------------- Stage 5: Developer workflow ---------------- */
  add({
    id: 'git-basics', stage: 5, track: 'tools', level: 'Intermediate', minutes: 30,
    title: 'Git and GitHub fundamentals',
    objectives: ['Explain a repository, a commit and a branch.', 'Use init, add, commit and status.', 'Push a project to GitHub.'],
    explain: [
      'Git is version control: it records snapshots of your project called commits, so you can go back and see what changed. GitHub is a website that hosts Git repositories online. Git is the tool; GitHub is one place to store the result.',
      'The basic cycle: change files, `git add` the ones you want, then `git commit -m "message"` to save the snapshot. `git status` shows what is changed and `git log` shows history. Write commit messages that say what changed, like "Add contact form".',
      'A branch is a separate line of work, so you can try an idea without breaking the main version. When it works, you merge it back. Reading the first two chapters of the free Pro Git book is the best next step.'
    ],
    syntax: { lang: 'sh', code: 'git init\ngit add .\ngit commit -m "First version of my site"\ngit branch -M main\ngit remote add origin https://github.com/YOUR-NAME/my-site.git\ngit push -u origin main' },
    example: { lang: 'sh', code: 'git status\ngit switch -c add-footer\n# edit files...\ngit add index.html\ngit commit -m "Add footer"\ngit switch main\ngit merge add-footer', output: 'A new branch holds the footer work, which is merged into main when finished.' },
    mistakes: ['Committing passwords or private keys.', 'Huge commit messages like "stuff".', 'Working directly on main for risky changes.'],
    note: { type: 'security', text: 'Anything you push to a public repository is public, including old commits. Never commit secrets, and use a .gitignore file for files you do not want to track.' },
    exercise: { task: 'Practise reading: put these commands in order for saving a change: commit, add, edit file. Then try them on your own computer once Git is installed.', starter: { html: '<ol>\n  <li>edit the file</li>\n  <li>git ___</li>\n  <li>git ___ -m "message"</li>\n</ol>', css: '', js: '' } },
    docs: [{ label: 'Pro Git (free book)', url: 'https://git-scm.com/book/en/v2' }, { label: 'GitHub docs', url: 'https://docs.github.com/' }]
  });

  add({
    id: 'github-pages', stage: 5, track: 'tools', level: 'Intermediate', minutes: 20,
    title: 'Publishing a static site',
    objectives: ['Explain what a static host does.', 'Publish with GitHub Pages.', 'Check HTTPS and links after publishing.'],
    explain: [
      'A static site is made only of files (HTML, CSS, JavaScript, images). Any static host can serve it. GitHub Pages is a popular free option that publishes files from a repository. Other hosts exist, and their free plans change, so check the current limits when you choose.',
      'The GitHub Pages quickstart explains the steps: create a repository, add your files, then open Settings → Pages and choose the branch to publish. GitHub notes that changes can take up to 10 minutes to appear.',
      'After publishing, open the real address on your phone and test every link and image. Paths that worked on your computer may fail if you used capital letters or absolute paths. HTTPS is needed for features such as service workers (offline apps) and installing a PWA.'
    ],
    syntax: { lang: 'text', code: 'Repository → Settings → Pages → Build and deployment\nChoose "Deploy from a branch", pick main and / (root), then Save.' },
    example: { lang: 'text', code: 'https://YOUR-NAME.github.io/REPOSITORY-NAME/', output: 'Project sites live under a folder name, so links should be relative (css/style.css), not start with a slash (/css/style.css).' },
    mistakes: ['Using paths that start with / in a project site.', 'Expecting instant updates.', 'Pushing the wrong folder.'],
    note: { type: 'tip', text: 'CrydenCode itself is a static site. Its README explains how to run it locally and put it on GitHub Pages.' },
    exercise: { task: 'Check each path: which of these will break in a project site? Edit the list to keep only safe relative paths.', starter: { html: '<link rel="stylesheet" href="/css/style.css">\n<link rel="stylesheet" href="css/style.css">\n<img src="Images/Logo.PNG" alt="Logo">', css: '', js: '' } },
    docs: [{ label: 'GitHub Pages quickstart', url: 'https://docs.github.com/en/pages/quickstart' }, { label: 'MDN: Service Worker API', url: MDN + 'Web/API/Service_Worker_API' }]
  });

  add({
    id: 'debugging', stage: 5, track: 'tools', level: 'Intermediate', minutes: 25,
    title: 'Debugging with DevTools',
    objectives: ['Read an error message.', 'Use console.log and breakpoints.', 'Follow a simple debugging routine.'],
    explain: [
      'Bugs are normal. Debugging is a method: reproduce the problem, find where it happens, form a guess, test it, and fix one thing at a time.',
      'Start with the Console. An error shows a message, a file and a line number. Common ones: `ReferenceError` (a name does not exist), `TypeError` (you used a value the wrong way, like calling a method on null) and `SyntaxError` (the code is not valid).',
      'In DevTools, open the Sources panel, click a line number to set a breakpoint, and reload. Execution stops there so you can look at variable values and step line by line. The Network panel shows failed requests, such as a 404 for a wrong file path.'
    ],
    syntax: { lang: 'js', code: 'console.log("value is", value);\nconsole.table(items);\ndebugger; // pauses here when DevTools is open' },
    example: { lang: 'js', code: 'const user = null;\ntry {\n  console.log(user.name);\n} catch (error) {\n  console.log(error.name + ": " + error.message);\n}', output: 'TypeError: Cannot read properties of null (reading \'name\') (wording may differ by browser).' },
    mistakes: ['Changing many things at once.', 'Ignoring the first error and reading the later ones.', 'Leaving debugger statements in finished code.'],
    note: { type: 'tip', text: 'Explain the problem out loud, step by step, to a friend or a rubber duck. You often spot the mistake before you finish.' },
    exercise: { task: 'This code has a bug. Run it, read the error in the console, then fix it.', starter: { html: '<p id="x">Hello</p>', css: '', js: 'const el = document.querySelector("#y");\nel.textContent = "Fixed";' } },
    docs: [{ label: 'Chrome DevTools docs', url: 'https://developer.chrome.com/docs/devtools' }, { label: 'MDN: JavaScript error reference', url: MDN + 'Web/JavaScript/Reference/Errors' }]
  });

  add({
    id: 'a11y-checks', stage: 5, track: 'tools', level: 'Intermediate', minutes: 25,
    title: 'Testing, accessibility checks and clean code',
    objectives: ['Run a quick manual test routine.', 'Check accessibility with keyboard and zoom.', 'Keep code readable.'],
    explain: [
      'Test as you build. A short routine: reload and watch the Console for errors; test at phone, tablet and desktop widths; zoom to 200%; press Tab through the whole page; and try the page with bad input (empty, very long, symbols).',
      'For accessibility, check: can every control be reached and used with a keyboard? Is the focus outline visible? Does every image have the right alt? Are labels linked to inputs? Is text contrast at least 4.5:1? WCAG 2.2 includes extra criteria about focus not being hidden and about tap target size, so keep buttons comfortably large.',
      'Readable code is also a kind of testing: choose clear names, keep functions short, use consistent indentation, and add a comment only to explain why, not what. Automated tests (small scripts that check your functions) are a later step; start by writing one by hand with console.assert.'
    ],
    syntax: { lang: 'js', code: 'function double(n) { return n * 2; }\nconsole.assert(double(2) === 4, "double(2) should be 4");\nconsole.assert(double(0) === 0, "double(0) should be 0");' },
    example: { lang: 'text', code: '[ ] Console has no errors\n[ ] Works at 320px, 768px and 1280px wide\n[ ] Usable at 200% zoom\n[ ] Tab reaches every control, focus is visible\n[ ] Every image has correct alt text\n[ ] Every form field has a label', output: 'Copy this checklist into each project and tick it before you publish.' },
    mistakes: ['Testing only on one screen size.', 'Removing outline: none without a replacement.', 'Only testing with perfect input.'],
    note: { type: 'a11y', text: 'No automatic tool finds every accessibility problem. Manual checks with a keyboard and a screen reader find things tools miss.' },
    exercise: { task: 'Run the checklist on the page in the editor: it has two problems. Find and fix them.', starter: { html: '<img src="logo.png">\n<input type="text" placeholder="Your name">\n<div class="btn" onclick="alert(1)">Send</div>', css: '', js: '' } },
    docs: [{ label: 'WCAG 2.2 quick reference', url: 'https://www.w3.org/WAI/WCAG22/quickref/' }, { label: 'MDN: console.assert', url: MDN + 'Web/API/console/assert_static' }]
  });

  /* ---------------- Stage 6: Projects ---------------- */
  add({
    id: 'plan-a-project', stage: 6, track: 'projects', level: 'Intermediate', minutes: 20,
    title: 'Planning and finishing a project',
    objectives: ['Break a project into small steps.', 'Decide what is in and out of scope.', 'Keep going when it gets hard.'],
    explain: [
      'Big projects feel scary until you break them up. Write the goal in one sentence, list what must work (the minimum), then list nice-to-have ideas for later. Build the smallest working version first, then improve it.',
      'Work in small steps and test after each one. Commit often if you use Git. When you are stuck, read the error, search the exact message, check the documentation (MDN is the best first place), and take a short break before asking for help.',
      'Finish things. A small project that works is worth more than a large one that does not. The projects page gives you requirements and a checklist for each one, so you know when it is done.'
    ],
    syntax: { lang: 'text', code: 'Goal: A to-do list that remembers tasks.\nMust: add, complete, delete, save.\nLater: filters, due dates.' },
    example: { lang: 'text', code: '1. Draw the screen on paper\n2. Write the HTML\n3. Add CSS for phone width\n4. Add JavaScript for one feature\n5. Test, fix, commit\n6. Repeat for the next feature', output: 'Each step produces something you can see and test.' },
    mistakes: ['Starting with the hardest feature.', 'Adding new ideas before the basics work.', 'Comparing your first project with finished professional sites.'],
    note: { type: 'tip', text: 'Keep a "done" list. It shows progress when it feels slow.' },
    exercise: { task: 'Write a goal, a "must" list and a "later" list for your own project idea in the HTML.', starter: { html: '<h1>My project plan</h1>\n<h2>Goal</h2>\n<p></p>\n<h2>Must have</h2>\n<ul><li></li></ul>\n<h2>Later</h2>\n<ul><li></li></ul>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; }', js: '' } },
    docs: [{ label: 'MDN: Learn web development', url: MDN + 'Learn_web_development' }, { label: 'MDN Curriculum', url: 'https://developer.mozilla.org/en-US/curriculum/' }]
  });

  add({
    id: 'next-steps', stage: 6, track: 'projects', level: 'Intermediate', minutes: 15,
    title: 'Next steps after the foundations',
    objectives: ['Know what to learn after this course.', 'Choose a direction without rushing.', 'Keep a learning habit.'],
    explain: [
      'After the core foundations, choose one direction at a time. TypeScript adds types to JavaScript. A front-end framework such as React, Vue or Svelte helps with larger interfaces. Back-end development (servers, databases, APIs) lets you save data for many users. None of them replaces the basics you have learned here.',
      'Tools and fashions change quickly, while HTML, CSS, JavaScript, the DOM and accessibility stay useful. When you pick a next tool, read its official documentation and build a small project with it before judging it.',
      'Habits beat bursts. Twenty minutes most days is better than a long session once a month. Your Progress page shows your study days so you can see the habit grow.'
    ],
    syntax: { lang: 'text', code: 'Month 1–2: finish the roadmap\nMonth 3: build a portfolio\nMonth 4+: pick ONE next topic' },
    example: { lang: 'text', code: 'Interested in…\n  design and interfaces → deeper CSS, accessibility, a framework\n  logic and data → more JavaScript, TypeScript, then back-end\n  making sites for others → portfolio + semantic HTML + performance', output: 'There is no single correct path.' },
    mistakes: ['Jumping to a framework before understanding the DOM.', 'Collecting tutorials and not building.', 'Learning three new tools at the same time.'],
    note: { type: 'tip', text: 'Teaching someone else is a quick way to find the gaps in what you know.' },
    exercise: { task: 'Write down your next topic and one small project you will build with it.', starter: { html: '<h1>My next step</h1>\n<p>I will learn: </p>\n<p>I will build: </p>', css: 'body { font-family: system-ui, sans-serif; padding: 1rem; }', js: '' } },
    docs: [{ label: 'MDN: Learn web development', url: MDN + 'Learn_web_development' }, { label: 'web.dev Learn', url: 'https://web.dev/learn' }]
  });
})();
