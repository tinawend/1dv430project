const express = require('express')
const app = express()
const mongoose = require('mongoose')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handlebar = require('express-handlebars')
const session = require('express-session')
const router = require('./routes/router')
const csrf = require('csurf')
const helmet = require('helmet')

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

app.use(helmet())
app.use(express.static('public'))

const hbs = handlebar.create({
  defaultLayout: 'main'
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

const port = process.env.PORT || '3000'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('socketio', io)

const SESS_NAME = 'sid'

app.use(session({
  name: SESS_NAME,
  secret: 'eiidnnkjnjbhgvhvj',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
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

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

app.use((req, res, next) => {
  res.status(404).send('Not found')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})
