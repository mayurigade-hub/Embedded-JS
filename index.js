const express = require('express');
const app = express();

const Port = 8080;

app.get('/', (req, res) => {
    res.render("home.ejs");
});

app.listen(8080);