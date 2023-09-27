const express = require("express");
const { engine } = require("express-handlebars");
const methodOverride = require('method-override')
const app = express();
const port = 3000;

const {User, Category, Record} = require('./models')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.get("/records/new", (req, res) => {
  res.render("new");
});

app.get("/records/:id/edit", (req, res, next) => {
  const id = req.params.id
  return Record.findByPk(id, {
    raw: true,
  })
    .then((record) => {
      if (!record) throw new Error('此紀錄不存在')
      res.render("edit", {record})})
    .catch(err => next(err))
});

app.put("/records/:id", (req, res, next) => {
  const id = req.params.id
  const { name, date, amount } = req.body
  return Record.findByPk(id)
    .then((record) => {
      if (!record) throw new Error('此紀錄不存在')
      return record.update({ name, date, amount })
    })
    .then(() => res.redirect('/records'))
})

app.get("/records", (req, res) => {
  return Record.findAll({
    raw: true
  })
    .then((records) => {
      let totalAmount = 0
      for(i=0; i<records.length; i++) {
        totalAmount += records[i].amount
      }
      res.render("home", {records, totalAmount});
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

app.delete("/records/:id", (req, res, next) => {
  const id = req.params.id
  return Record.findByPk(id)
    .then((record) => {
      if (!record) throw new Error("此紀錄不存在")
      return record.destroy()
    })
    .then(() => {
      res.redirect('/records')
    })
})

app.get("/", (req, res) => {
  res.redirect('/records')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
