const express = require('express');
const app = express();


const Port = 8080;

app.set("view engine", "ejs");
app.use(express.static("public"));

//to get this from parent dir 
// app.use(express.static(path.join(__dirname, "public")));

app.get("/ig/:username", (req, res) => {
    let { username } = req.params;
    const instaData = require('./data.json');
    const data = instaData[username];
    res.render("instagram.ejs", { data });
})

app.listen(8080);