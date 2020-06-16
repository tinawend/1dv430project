const express = require('express')
const app = express()
const mongoose = require('mongoose')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handlebar = require('express-handlebars')
const session = require('express-session')
const router = require('./routes/router')
// var multer = require('multer')
// var upload = multer()
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
// dropzone här
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   path: '/myapp'
// })

// app.use('/peerjs', peerServer)
// app.use(multer({ dest: './uploads/' }).single('img'))

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// var upload = multer({ storage: storage })

app.use(express.static('public'))
// app.use('/scripts', express.static(`${__dirname}/node_modules/`))

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

// io.on('connection', (socket) => {
//   // // callback function after connection is made to the client
//   // console.log('user' + socket.id)
//   // // recieves a chat event, then sends the data to other sockets
//   // socket.on('userMessage', (data) => {
//   //   io.sockets.emit('userMessage', data)
//   // })
//   socket.emit('chat-message', 'Hello world')
// })

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

// io.on('connection', (socket) => {
//   console.log('a user conected')
//   socket.on('create or join', function (room) {
//     console.log('create or join to room', room)
//     var myRoom = io.sockets.adapter.rooms[room] || { length: 0 }
//     var numClients = myRoom.length
//     console.log(room, 'has', numClients, 'clients')
//     if (numClients === 0) {
//       socket.join(room)
//       socket.emit('created', room)
//     } else if (numClients >= 1) {
//       socket.join(room)
//       socket.emit('joined', room)
//     } else { socket.emit('full', room) }
//   })

//   socket.on('ready', function (room) {
//     socket.broadcast.to(room).emit('ready')
//   })
//   socket.on('candidate', function (event) {
//     socket.broadcast.to(event.room).emit('candidate', event)
//   })

//   socket.on('offer', function (event) {
//     socket.broadcast.to(event.room).emit('offer', event.sdp)
//   })
//   socket.on('answer', function (event) {
//     socket.broadcast.to(event.room).emit('answer', event.sdp)
//   })
// })

app.use((req, res, next) => {
  res.status(404).send('Not found')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})
