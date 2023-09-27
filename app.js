const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')

app.get("/records/new", (req, res) => {
  res.render("new");
});

app.get("/records", (req, res) => {
  res.render("home");
});

app.get("/", (req, res) => {
  res.redirect('/records')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
