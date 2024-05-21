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
console.log(__dirname);

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

app.listen(3000, () => {
    console.log('Blog app listening on port 3000!');
});
