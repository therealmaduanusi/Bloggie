# Blog Web Application

### Overview
This is a simple blog web application built using Node.js, Express.js, and EJS. The application allows users to create, view, update, and delete blog posts. The posts do not persist between sessions as this version does not use a database. The application is styled to provide a good user experience and is responsive for both desktop and mobile devices.

### Features
- Post Creation: Users can create new blog posts.
- Post Viewing: Users can view all their blog posts on the home page.
- Post Update/Delete: Users can edit and delete their blog posts.
- Responsive Styling: The application is well-styled and responsive, ensuring a good user experience on both desktop and mobile devices.

### Project Structure
``` arduino
blog-app/
├── api/
│   └── index.js
├── public/
│   └── styles.css
├── views/
│   ├── layout.ejs
│   ├── index.ejs
│   ├── new.ejs
│   ├── edit.ejs
├── posts.js
├── app.js
├── package.json
└── vercel.json
```

### Installation
1. Clone the repository:
``` bash
git clone https://github.com/yourusername/blog-app.git
cd blog-app
```
2. Install dependencies:
``` bash
npm install
```
3. Run the application locally:
``` bash
node api/index.js
```
The application will be accessible at http://localhost:3000.

### Deployment on Vercel
1. Install Vercel CLI:
``` bash
npm install -g vercel
```
2. Log in to Vercel:
``` bash
vercel login
```
3. Deploy the application:
In the root directory of your project, run:
``` bash
vercel
```
> [!NOTE]
> When prompted, specify ./ as the directory for your code.

#### Example
```bash
? Set up and deploy “~/path/to/your/project”? [Y/n] y
? Which scope do you want to deploy to? Your-Scope
? Link to existing project? [y/N] n
? What’s your project’s name? your-project-name
? In which directory is your code located? ./
```
### Configuration Files
#### app.js
The main server setup and routing logic:
``` js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const posts = require('./posts');

app.set('views', path.join(__dirname, 'views'));  // Ensure the views directory is correctly set
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));  // Ensure the public directory is correctly set
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { posts: posts.getAll() });
});

app.get('/posts/new', (req, res) => {
    res.render('new');
});

app.post('/posts', (req, res) => {
    posts.create(req.body.title, req.body.content);
    res.redirect('/');
});

app.get('/posts/:id/edit', (req, res) => {
    const post = posts.get(req.params.id);
    res.render('edit', { post });
});

app.put('/posts/:id', (req, res) => {
    posts.update(req.params.id, req.body.title, req.body.content);
    res.redirect('/');
});

app.delete('/posts/:id', (req, res) => {
    posts.delete(req.params.id);
    res.redirect('/');
});

module.exports = app;
```
#### posts.js
The in-memory data store for posts:
``` js
let posts = [];
let currentId = 1;

function create(title, content) {
    posts.push({ id: currentId++, title, content });
}

function getAll() {
    return posts;
}

function get(id) {
    return posts.find(post => post.id === parseInt(id));
}

function update(id, title, content) {
    const post = posts.find(post => post.id === parseInt(id));
    if (post) {
        post.title = title;
        post.content = content;
    }
}

function deletePost(id) {
    posts = posts.filter(post => post.id !== parseInt(id));
}

module.exports = { create, getAll, get, update, delete: deletePost };
```
#### api/index.js
Vercel's entry point for the serverless function:
``` js
const app = require('../app');
module.exports = app;
``` 
#### vercel.json
Configuration file for Vercel:
``` json
{
  "version": 2,
  "builds": [
    { "src": "api/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "api/index.js" }
  ]
}
```

### Views
EJS templates for rendering HTML:

#### views/layout.ejs
Basic HTML layout template:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog App</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <h1>Blog App</h1>
        <nav>
            <a href="/">Home</a>
            <a href="/posts/new">New Post</a>
        </nav>
    </header>
    <main>
        <%- body %>
    </main>
</body>
</html>
```
#### views/index.ejs
Template for displaying all posts:
``` html
<% include layout.ejs %>
<h2>All Posts</h2>
<ul>
    <% posts.forEach(post => { %>
        <li>
            <h3><%= post.title %></h3>
            <p><%= post.content %></p>
            <a href="/posts/<%= post.id %>/edit">Edit</a>
            <form action="/posts/<%= post.id %>?_method=DELETE" method="POST">
                <button type="submit">Delete</button>
            </form>
        </li>
    <% }) %>
</ul>
```
#### views/new.ejs
Template for creating a new post:
``` html
<% include layout.ejs %>
<h2>New Post</h2>
<form action="/posts" method="POST">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" required>
    <label for="content">Content:</label>
    <textarea id="content" name="content" required></textarea>
    <button type="submit">Create</button>
</form>
```
#### views/edit.ejs
Template for editing an existing post:
``` html
<% include layout.ejs %>
<h2>Edit Post</h2>
<form action="/posts/<%= post.id %>?_method=PUT" method="POST">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" value="<%= post.title %>" required>
    <label for="content">Content:</label>
    <textarea id="content" name="content" required><%= post.content %></textarea>
    <button type="submit">Update</button>
</form>
```
### Styling
#### public/styles.css
Basic CSS for styling the application:
``` css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    background-color: #333;
    color: #fff;
    padding: 10px 0;
    text-align: center;
}

nav a {
    color: #fff;
    margin: 0 10px;
    text-decoration: none;
}

.homePage{
    border-bottom: 2px solid #fff;
}
.newPost {
    background-color: rgb(51, 156, 255);
    color: #fff;
    padding: 0.5rem;
    border-radius: 2px;
}
.homePage:hover,
.newPost:hover{
    opacity: 0.7;
}
.noPost{
    text-align: center;
}
.editPost{
    text-decoration: none;
    color: #fff;
    background-color: rgb(51, 156, 255);
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
}

main {
    padding: 20px;
}

form {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
}

form label {
    margin-top: 10px;
}

form input, form textarea {
    padding: 10px;
    margin-top: 5px;
}

form textarea {
    height: 150px;
    resize: none;
}

button {
    margin-top: 10px;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
}

button:hover {
    opacity: 0.7;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    background-color: #fff;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ddd;
}
```
> [!NOTE]
> Please note that there are some basic inline style in some ejs file.
#### Example
``` html
<button style="background-color: red; color: #fff;" type="submit">Delete</button>
```
### License
This project is licensed under the MIT License. See the LICENSE file for more details.

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

> [!TIP]
> This README provides an overview of your project, detailed instructions for installation and deployment, and the necessary code snippets for reference.
