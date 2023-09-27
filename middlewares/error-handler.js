module.exports = (error, req, res, next) => {
  console.error(error)
  req.flash('error', error.message || '系統錯誤')
  res.redirect('back')
  next(error)
}