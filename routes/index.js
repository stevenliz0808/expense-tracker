const express = require('express')
const router = express.Router()

const { Record } = require("../models");

router.get("/records/new", (req, res) => {
  res.render("new");
});

router.post("/records", (req, res, next) => {
  const { name, date, amount } = req.body;
  const userId = 1;
  const categoryId = 1;
  return Record.create({ name, date, amount, userId, categoryId })
    .then(() => {
      req.flash("success", "新增成功");
      res.redirect("/records");
    })
    .catch((error) => {
      error.message = "新增失敗";
      next(error);
    });
});

router.get("/records/:id/edit", (req, res, next) => {
  const id = req.params.id;
  return Record.findByPk(id, {
    raw: true,
  })
    .then((record) => {
      if (!record) throw new Error("此紀錄不存在");
      res.render("edit", { record });
    })
    .catch((err) => next(err));
});

router.put("/records/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, date, amount } = req.body;
  return Record.findByPk(id)
    .then((record) => {
      if (!record) throw new Error("此紀錄不存在");
      return record.update({ name, date, amount });
    })
    .then(() => {
      req.flash("success", "修改成功");
      res.redirect("/records");
    })
    .catch((error) => {
      error.message = "修改失敗";
      next(error);
    });
});

router.delete("/records/:id", (req, res, next) => {
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
    .catch((error) => {
      error.message = "刪除失敗";
      next(error);
    });
});

router.get("/records", (req, res) => {
  return Record.findAll({
    raw: true,
  }).then((records) => {
    let totalAmount = 0;
    for (i = 0; i < records.length; i++) {
      totalAmount += records[i].amount;
    }
    res.render("home", { records, totalAmount });
  });
});

router.get("/", (req, res) => {
  res.redirect("/records");
});

module.exports = router