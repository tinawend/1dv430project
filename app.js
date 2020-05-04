const express = require('express')
const app = express()
const mongoose = require('mongoose')
const handlebar = require('express-handlebars')
const session = require('express-session')
const router = require('./routes/router')
const csrf = require('csurf')

require('dotenv').config()
mongoose.connect(`${process.env.DB_LINK}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('open')
})

db.on('connected', () => {
  console.log('Opened conection')
})

app.use(express.static('public'))

const hbs = handlebar.create({
  defaultLayout: 'main'
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
const port = process.env.PORT || '4000'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const SESS_NAME = 'sid'

app.use(session({
  name: SESS_NAME,
  secret: 'eiidnnkjnjbhgvhvj',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))

app.use(csrf())
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  res.locals.csrfToken = req.csrfToken()
  delete req.session.flash
  next()
})
app.use('/scripts', express.static(`${__dirname}/node_modules/`))

app.use('/', router)
app.set('port', port)
app.listen(port, () => console.log(`API running on localhost:${port}`))

app.use((req, res, next) => {
  res.status(404).send('Not found')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})
