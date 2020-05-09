const socket = window.io()

socket.on('message', function (message) {
  console.log('The server has a message for you: ' + message)
})

function getLVideo (callbacks) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
  const constraints = {
    audio: true,
    video: true
  }
  navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
}

function recStream (stream, elemid) {
  const video = document.querySelector(elemid)
  video.srcObject = stream

  window.peer_stream = stream
}

getLVideo({
  success: function (stream) {
    window.localStream = stream
    recStream(stream, '#lvideo')
  },
  error: function (err) {
    alert('cannot access your camera')
    console.log(err)
  }
})

var conn
var peerid

var peer = new Peer({ key: 'lwjd5qra8257b9' })

peer.on('open', function () {
  document.querySelector('#displayId').textContent = peer.id
})

peer.on('connection', function (connection) {
  conn = connection
  peerid = connection.peer

  document.querySelector('#connId').value = peerid
})

peer.on('error', function (err) {
  alert('an error has happened:' + err)
  console.log(err)
})

document.querySelector('#conn_button').addEventListener('click', function () {
  peerid = document.querySelector('#connId').value

  if (peerid) {
    conn = peer.connect(peerid)
  } else {
    alert('enter an id')
    return false
  }
})

peer.on('call', function (call) {
  var acceptCall = confirm('Do you want to answer this call?')

  if (acceptCall) {
    call.answer(window.localStream)

    call.on('stream', function (stream) {
      window.peer_stream = stream

      recStream(stream, '#rVideo')
    })
    call.on('close', function () {
      alert('the call has ended')
    })
  } else {
    console.log('call denied')
  }
})

document.querySelector('#call_button').addEventListener('click', function () {
  console.log('calling a peer' + peerid)
  console.log(peer)

  var call = peer.call(peerid, window.localStream)

  call.on('stream', function (stream) {
    window.peer_stream = stream

    recStream(stream, '#rVideo')
  })
})
