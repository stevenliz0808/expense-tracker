const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

const {User, Category, Record} = require('./models')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(express.urlencoded({extended: true}))

app.get("/records/new", (req, res) => {
  res.render("new");
});

app.get("/records/:id/edit", (req, res) => {
  res.render("edit");
});

app.get("/records", (req, res) => {
  return Record.findAll({
    raw: true
  })
    .then((records) => {
      console.log(records[0])
      res.render("home", {records});
    })
  
});

app.post("/records", (req, res, next) => {
  const {name, date, amount} = req.body
  const userId = 1
  const categoryId = 1
  return Record.create({name, date, amount, userId, categoryId})
    .then(() => {
      res.redirect('/records')
    })
    .catch(err => next(err))
});

app.get("/", (req, res) => {
  res.redirect('/records')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
