const express = require("express");
const { engine } = require("express-handlebars");
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const port = 3000;

const {User, Category, Record} = require('./models')

const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'SECERT',
  resave: false,
  saveUninitialized: false
}))

app.use(flash())
app.use(messageHandler);

app.get("/records/new", (req, res) => {
  res.render("new");
});

app.post("/records", (req, res, next) => {
  const { name, date, amount } = req.body;
  const userId = 1;
  const categoryId = 1;
  return Record.create({ name, date, amount, userId, categoryId })
    .then(() => {
      req.flash('success', '新增成功')
      res.redirect("/records");
    })
    .catch((error) => {
      error.message = "新增失敗"
      next(error)});
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
    .then(() => {
      req.flash("success", "修改成功");
      res.redirect('/records')
    })
    .catch(error => {
      error.message = '修改失敗'
      next(error)
    })
})

app.delete("/records/:id", (req, res, next) => {
  const id = req.params.id;
  return Record.findByPk(id)
    .then((record) => {
      if (!record) throw new Error("此紀錄不存在");
      return record.destroy();
    })
    .then(() => {
      req.flash("success", "刪除成功");
      res.redirect("/records");
    })
    .catch(error => {
      error.message = '刪除失敗'
      next(error)
    })
});

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


app.get("/", (req, res) => {
  res.redirect('/records')
});

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
