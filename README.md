# EJS (Embedded JavaScript) --- simple explanation

## 1. What is EJS?

**EJS stands for Embedded JavaScript.** It is a templating engine that
lets you generate dynamic HTML using JavaScript.

Instead of creating a separate HTML page for every user or piece of
data, you can create one reusable `.ejs` template and pass different
data to it.

For example, a template can contain:

``` ejs
<h1>Welcome, <%= name %>!</h1>
```

If the server passes `{ name: "Mayuri" }`, EJS renders:

``` html
<h1>Welcome, Mayuri!</h1>
```

EJS runs on the server. The browser receives the rendered HTML, not the
original EJS template.

------------------------------------------------------------------------

## 2. Why use EJS?

EJS is useful when you need to:

-   Display dynamic data in HTML.
-   Generate pages from arrays or objects.
-   Show different content using conditions.
-   Repeat HTML using loops.
-   Reuse common page components such as headers, navbars, and footers.

------------------------------------------------------------------------

## 3. Install EJS

Install Express and EJS in your Node.js project:

``` bash
npm install express ejs
```

A basic project structure looks like this:

``` text
my-project/
├── app.js
├── package.json
├── public/
│   └── style.css
└── views/
    ├── home.ejs
    └── includes/
        ├── navbar.ejs
        └── footer.ejs
```

-   `app.js` contains the Express server and routes.
-   `views/` stores EJS templates by default.
-   `public/` stores static files such as CSS, images, and browser-side
    JavaScript.

------------------------------------------------------------------------

## 4. Configure EJS in Express

In `app.js`:

``` js
const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home", { name: "Mayuri" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

Create `views/home.ejs`:

``` ejs
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
</head>
<body>
    <h1>Welcome, <%= name %>!</h1>
</body>
</html>
```

Run the server:

``` bash
node app.js
```

Open `http://localhost:3000/`. The page displays **Welcome, Mayuri!**

### Important Express methods

-   `app.set("view engine", "ejs")` configures EJS as the view engine.
-   `res.render("home", data)` renders `views/home.ejs` with the
    supplied data.
-   `res.send()` sends a response directly; `res.render()` renders a
    template before sending the response.

------------------------------------------------------------------------

## 5. EJS Tag Syntax

EJS uses special tags to distinguish output from JavaScript logic.

### `<%= value %>` --- Output escaped content

``` ejs
<h1>Hello, <%= name %></h1>
```

This outputs the value while escaping HTML special characters. It is the
usual choice for displaying user-provided text safely.

### `<%- value %>` --- Output unescaped content

``` ejs
<div><%- trustedHtml %></div>
```

This inserts content without HTML escaping. Use it only when the HTML is
trusted. Unescaped user input can create cross-site scripting (XSS)
vulnerabilities.

### `<% code %>` --- Execute JavaScript without directly outputting it

``` ejs
<% const message = "Hello"; %>
<p>Welcome!</p>
```

The JavaScript runs, but the tag itself does not directly print its
result.

### Quick reference

  Tag              Purpose
  ---------------- --------------------------
  `<%= value %>`   Output an escaped value
  `<%- value %>`   Output unescaped content
  `<% code %>`     Execute JavaScript logic

------------------------------------------------------------------------

## 6. Passing Data to EJS

Pass data as the second argument to `res.render()`.

In `app.js`:

``` js
app.get("/profile", (req, res) => {
    const user = {
        name: "Mayuri",
        city: "Mumbai"
    };

    res.render("profile", { user });
});
```

In `views/profile.ejs`:

``` ejs
<h1><%= user.name %></h1>
<p>City: <%= user.city %></p>
```

The object is available in the template under the name `user`.

You can pass multiple values:

``` js
res.render("home", {
    name: "Mayuri",
    age: 21
});
```

Then use `<%= name %>` and `<%= age %>` in the template.

------------------------------------------------------------------------

## 7. Conditional Statements

Use JavaScript conditions inside `<% %>` tags to decide which HTML to
render.

``` ejs
<% if (isLoggedIn) { %>
    <h1>Welcome back!</h1>
<% } else { %>
    <h1>Please log in.</h1>
<% } %>
```

The condition is evaluated on the server while EJS renders the page.

You can also use `else if`:

``` ejs
<% if (score >= 90) { %>
    <p>Grade A</p>
<% } else if (score >= 70) { %>
    <p>Grade B</p>
<% } else { %>
    <p>Grade C</p>
<% } %>
```

------------------------------------------------------------------------

## 8. Loops

Loops are useful for rendering repeated HTML from an array.

In `app.js`:

``` js
app.get("/fruits", (req, res) => {
    const fruits = ["Apple", "Mango", "Banana"];
    res.render("fruits", { fruits });
});
```

In `views/fruits.ejs`:

``` ejs
<h1>Fruits</h1>

<ul>
    <% fruits.forEach(fruit => { %>
        <li><%= fruit %></li>
    <% }); %>
</ul>
```

Each array item produces one `<li>` element.

A traditional `for` loop also works:

``` ejs
<% for (let i = 0; i < fruits.length; i++) { %>
    <p><%= fruits[i] %></p>
<% } %>
```

------------------------------------------------------------------------

## 9. Working with JSON Data

JSON (JavaScript Object Notation) is a text format for structured data.

Example `data.json`:

``` json
[
    {
        "username": "mayuri",
        "content": "Learning EJS"
    },
    {
        "username": "rahul",
        "content": "Learning Express"
    }
]
```

A CommonJS Node.js project can read and parse the file:

``` js
const fs = require("node:fs");

const rawData = fs.readFileSync("data.json", "utf8");
const posts = JSON.parse(rawData);
```

Then pass the data to EJS:

``` js
app.get("/posts", (req, res) => {
    res.render("posts", { posts });
});
```

In `views/posts.ejs`:

``` ejs
<h1>Posts</h1>

<% posts.forEach(post => { %>
    <article>
        <h3>@<%= post.username %></h3>
        <p><%= post.content %></p>
    </article>
<% }); %>
```

For a real application, handle file-reading or JSON-parsing errors
appropriately. The example uses synchronous file reading for simplicity.

------------------------------------------------------------------------

## 10. Serving Static Files

EJS creates the HTML page, but CSS, images, and browser-side JavaScript
are usually served as static files.

Project structure:

``` text
my-project/
├── app.js
├── public/
│   ├── style.css
│   └── images/
│       └── logo.png
└── views/
    └── home.ejs
```

Configure Express:

``` js
app.use(express.static("public"));
```

Now `public/style.css` can be requested at `/style.css`, and
`public/images/logo.png` at `/images/logo.png`.

In `views/home.ejs`:

``` html
<link rel="stylesheet" href="/style.css">
```

In `public/style.css`:

``` css
body {
    font-family: Arial, sans-serif;
}

h1 {
    color: blue;
}
```

  -----------------------------------------------------------------------
  `views/`                            `public/`
  ----------------------------------- -----------------------------------
  Stores EJS templates                Stores static assets

  Templates are rendered with         Files are served with
  `res.render()`                      `express.static()`
  -----------------------------------------------------------------------

For projects launched from different working directories, configure the
static directory using an absolute path for more reliable path
resolution.

------------------------------------------------------------------------

## 11. Includes

EJS includes let you reuse one template inside another. They are useful
for navbars, headers, and footers.

Example structure:

``` text
views/
├── home.ejs
└── includes/
    ├── navbar.ejs
    └── footer.ejs
```

`views/includes/navbar.ejs`:

``` ejs
<nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
</nav>
```

`views/includes/footer.ejs`:

``` ejs
<footer>
    <p>Copyright 2026</p>
</footer>
```

Use them in `views/home.ejs`:

``` ejs
<!DOCTYPE html>
<html>
<body>
    <%- include("includes/navbar.ejs") %>

    <h1>Welcome to my website!</h1>

    <%- include("includes/footer.ejs") %>
</body>
</html>
```

You can pass local data to an include:

``` ejs
<%- include("includes/navbar.ejs", { pageTitle: "Home" }) %>
```

Inside `navbar.ejs`:

``` ejs
<h2><%= pageTitle %></h2>
```

Use unescaped include output for trusted template HTML. Do not use
unescaped output to insert arbitrary user-provided HTML.

------------------------------------------------------------------------

## 12. How EJS Works

The usual request flow is:

1.  A browser requests a URL.
2.  Express matches the route.
3.  The route calls `res.render()` and supplies data.
4.  EJS processes interpolation, conditions, loops, and includes.
5.  Express sends the generated HTML to the browser.

``` text
Browser request
      ↓
Express route
      ↓
res.render("template", data)
      ↓
EJS renders the template
      ↓
HTML response
      ↓
Browser displays the page
```

------------------------------------------------------------------------

## 13. EJS vs Static HTML

  -----------------------------------------------------------------------
  Static HTML                         EJS
  ----------------------------------- -----------------------------------
  Content is written directly in the  Content can be generated from data
  file                                

  No server-side template logic       Supports JavaScript conditions and
                                      loops

  Suitable for fixed pages            Useful for data-driven pages

  Does not require a template engine  Requires EJS and a server-side
                                      rendering setup
  -----------------------------------------------------------------------

## Key Takeaways

-   EJS means **Embedded JavaScript**.
-   Install it using `npm install ejs`.
-   Configure Express using `app.set("view engine", "ejs")`.
-   Use `res.render()` to render templates and pass data.
-   Use `<%= %>` for escaped output, `<%- %>` for unescaped output, and
    `<% %>` for logic.
-   Use conditions and loops to generate dynamic HTML.
-   Use `express.static()` to serve CSS, images, and other static
    assets.
-   Use `include()` to reuse templates.
-   Avoid unescaped rendering of untrusted input because it can cause
    XSS vulnerabilities.
