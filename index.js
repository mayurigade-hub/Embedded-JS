const express = require('express');
const app = express();
const instaData = require('./data.json');

const Port = 8080;

app.set("view engine", "ejs");

app.get("/ig/:username", (req, res) => {
    res.render("instagram.ejs", { username: req.params.username });
})

app.listen(8080);