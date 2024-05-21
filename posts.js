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