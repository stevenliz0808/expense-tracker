const express = require("express");
const { engine } = require("express-handlebars");
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const port = 3000;

const router = require('./routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler');
const handlebarsHelper = require("./helpers/handlebars-helper");

app.engine('.hbs', engine({extname: '.hbs', helpers: handlebarsHelper}))
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
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
