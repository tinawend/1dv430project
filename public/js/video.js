// Denna videochat har jag hämtat inspiration ifrån denna video https://www.youtube.com/watch?v=OOrBcpwelPY&t=2628s
var Peer

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
    window.alert('cannot access your camera')
    console.log(err)
  }
})

var conn
var peerid

var peer = new Peer(document.querySelector('#username').value)

peer.on('open', function (req, res) {
  console.log(document.querySelector('#username'))
  document.querySelector('#displayId').textContent = document.querySelector('#username').value
})

peer.on('connection', function (connection) {
  conn = connection
  peerid = connection.peer

  document.querySelector('#connId').value = peerid
})

peer.on('error', function (err) {
  window.alert('an error has happened:' + err)
  console.log(err)
})

peer.on('call', function (call) {
  var acceptCall = window.confirm('Do you want to answer this call?')

  if (acceptCall) {
    call.answer(window.localStream)

    call.on('stream', function (stream) {
      window.peer_stream = stream

      recStream(stream, '#rVideo')
    })
    call.on('close', function () {
      window.alert('the call has ended')
    })
  } else {
    console.log('call denied')
  }
})

document.querySelector('#call_button').addEventListener('click', function () {
  peerid = document.querySelector('#connId').value
  if (peerid) {
    conn = peer.connect(peerid)
  } else {
    window.alert('enter an id')
    return false
  }
  console.log('calling a peer ' + peerid)
  console.log(peer)

  var call = peer.call(peerid, window.localStream)

  call.on('stream', function (stream) {
    window.peer_stream = stream

    recStream(stream, '#rVideo')
  })
})
