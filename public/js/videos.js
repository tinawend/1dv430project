// Not in use!!!!
// Försök till gruppchat

// app.js
// io.on('connection', (socket) => {
//   // //! callback function after connection is made to the client
//   // console.log('user' + socket.id)
//   // // recieves a chat event, then sends the data to other sockets
//   // socket.on('userMessage', (data) => {
//   //   io.sockets.emit('userMessage', data)
//   // })
//   socket.emit('chat-message', 'Hello world')
// })

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

// Videos.js
// const socket = window.io()

// var divSelectRoom = document.querySelector('#selectRoom')
// var divConsoultingRoom = document.querySelector('#consoultingRoom')
// var inputRoomNumber = document.querySelector('#roomNumber')
// var btnGoRoom = document.querySelector('#goRoom')
// var localVideo = document.querySelector('#localVideo')
// var remoteVideo = document.querySelector('#remoteVideo')
// var remoteVideo1 = document.querySelector('#remoteVideo1')

// var roomNumber
// var localStream
// var remoteStream
// var remoteStream1
// var rtcPeerConnection = []
// var iceServers = {
//   iceServers: [
//     { url: 'stun:stun.services.mozilla.com' },
//     { url: 'stun:stun.l.google.com:19302' }
//   ]
// }

// var streamConstraints = { audio: true, video: true }
// var isCaller

// // const socket = io()

// btnGoRoom.onclick = function () {
//   if (inputRoomNumber.value === '') {
//     alert('Pleas type a room nr')
//   } else {
//     roomNumber = inputRoomNumber.value
//     socket.emit('create or join', roomNumber)
//     divSelectRoom.style = 'display: none'
//     divConsoultingRoom.style = 'display: block'
//   }
// }

// socket.on('created', function (room) {
//   navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
//     localStream = stream
//     // localVideo.src = window.URL.createObjectURL(stream)
//     localVideo.srcObject = stream
//     isCaller = true
//   }).catch(function (err) {
//     console.log('error' + err)
//   })
// })

// socket.on('joined', function (room) {
//   navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
//     localStream = stream
//     // localVideo.src = URL.createObjectURL(stream)
//     localVideo.srcObject = stream
//     socket.emit('ready', roomNumber)
//   }).catch(function (err) {
//     console.log('error' + err)
//   })
// })

// socket.on('ready', function () {
//   if (isCaller) {
//     rtcPeerConnection = new RTCPeerConnection(iceServers)
//     rtcPeerConnection.onicecandidate = onIceCandidate
//     rtcPeerConnection.onaddstream = onAddStream
//     rtcPeerConnection.onaddstream = onAddStream1
//     rtcPeerConnection.addStream(localStream)
//     rtcPeerConnection.createOffer(setLocalAndOffer, function (e) {
//       console.log(e)
//     })
//   }
// })

// socket.on('offer', function (event) {
//   if (!isCaller) {
//     rtcPeerConnection = new RTCPeerConnection(iceServers)
//     rtcPeerConnection.onicecandidate = onIceCandidate
//     rtcPeerConnection.onaddstream = onAddStream
//     rtcPeerConnection.onaddstream = onAddStream1
//     rtcPeerConnection.addStream(localStream)
//     rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
//     rtcPeerConnection.createAnswer(setLocalAndAnswer, function (e) {
//       console.log(e)
//     })
//   }
// })

// socket.on('answer', function (event) {
//   rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
// })

// socket.on('candidate', function (event) {
//   var candidate = new RTCIceCandidate({
//     sdpMLineIndex: event.label,
//     candidate: event.candidate

//   })
//   rtcPeerConnection.addIceCandidate(candidate)
// })

// function onAddStream (event) {
//   // remoteVideo.src = URL.createObjectURL(event.stream)
//   remoteVideo.srcObject = event.stream
//   remoteStream = event.stream
// }
// function onAddStream1 (event) {
//   // remoteVideo.src = URL.createObjectURL(event.stream)
//   remoteVideo1.srcObject = event.stream
//   remoteStream1 = event.stream
// }

// function onIceCandidate (event) {
//   if (event.candidate) {
//     console.log('sending ice candidate')
//     socket.emit('candidate', {
//       type: 'candidate',
//       label: event.candidate.sdpMLineIndex,
//       id: event.candidate.sdpMid,
//       candidate: event.candidate.candidate,
//       room: roomNumber

//     })
//   }
// }

// function setLocalAndOffer (sessionDescription) {
//   rtcPeerConnection.setLocalDescription(sessionDescription)
//   socket.emit('offer', {
//     type: 'offer',
//     sdp: sessionDescription,
//     room: roomNumber
//   })
// }

// function setLocalAndAnswer (sessionDescription) {
//   rtcPeerConnection.setLocalDescription(sessionDescription)
//   socket.emit('answer', {
//     type: 'answer',
//     sdp: sessionDescription,
//     room: roomNumber
//   })
// }
