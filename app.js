const express = require('express')
const app = express()
const mongoose = require('mongoose')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handlebar = require('express-handlebars')
const session = require('express-session')
const router = require('./routes/router')
// const { ExpressPeerServer } = require('peer')
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

// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   path: '/myapp'
// })

// app.use('/peerjs', peerServer)

app.use(express.static('public'))
// app.use('/scripts', express.static(`${__dirname}/node_modules/`))

const hbs = handlebar.create({
  defaultLayout: 'main'
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

const port = process.env.PORT || '9000'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('socketio', io)

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

app.use('/', router)
app.set('port', port)
server.listen(port, () => console.log(`API running on localhost:${port}`))

io.on('connection', (socket) => {
  console.log('connect')
  socket.emit('message', 'You are connected!')
})

app.use((req, res, next) => {
  res.status(404).send('Not found')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})
