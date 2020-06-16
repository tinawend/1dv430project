// 'use strict'

// const startButton = document.getElementById('startButton')
// const callButton = document.getElementById('callButton')
// const hangupButton = document.getElementById('hangupButton')
// callButton.disabled = true
// hangupButton.disabled = true
// startButton.onclick = start
// callButton.onclick = call
// hangupButton.onclick = hangup

// const video1 = document.querySelector('video#video1')
// const video2 = document.querySelector('video#video2')
// const video3 = document.querySelector('video#video3')

// let pc1Local
// let pc1Remote
// let pc2Local
// let pc2Remote
// const offerOptions = {
//   offerToReceiveAudio: 1,
//   offerToReceiveVideo: 1
// }

// function gotStream (stream) {
//   console.log('Received local stream')
//   video1.srcObject = stream
//   window.localStream = stream
//   callButton.disabled = false
// }

// function start () {
//   console.log('Requesting local stream')
//   startButton.disabled = true
//   navigator.mediaDevices
//     .getUserMedia({
//       audio: true,
//       video: true
//     })
//     .then(gotStream)
//     .catch(e => console.log('getUserMedia() error: ', e))
// }

// function call () {
//   callButton.disabled = true
//   hangupButton.disabled = false
//   console.log('Starting calls')
//   const audioTracks = window.localStream.getAudioTracks()
//   const videoTracks = window.localStream.getVideoTracks()
//   if (audioTracks.length > 0) {
//     console.log(`Using audio device: ${audioTracks[0].label}`)
//   }
//   if (videoTracks.length > 0) {
//     console.log(`Using video device: ${videoTracks[0].label}`)
//   }
//   // Create an RTCPeerConnection via the polyfill.
//   const servers = null
//   pc1Local = new RTCPeerConnection(servers)
//   pc1Remote = new RTCPeerConnection(servers)
//   pc1Remote.ontrack = gotRemoteStream1
//   pc1Local.onicecandidate = iceCallback1Local
//   pc1Remote.onicecandidate = iceCallback1Remote
//   console.log('pc1: created local and remote peer connection objects')

//   pc2Local = new RTCPeerConnection(servers)
//   pc2Remote = new RTCPeerConnection(servers)
//   pc2Remote.ontrack = gotRemoteStream2
//   pc2Local.onicecandidate = iceCallback2Local
//   pc2Remote.onicecandidate = iceCallback2Remote
//   console.log('pc2: created local and remote peer connection objects')

//   window.localStream.getTracks().forEach(track => pc1Local.addTrack(track, window.localStream))
//   console.log('Adding local stream to pc1Local')
//   pc1Local
//     .createOffer(offerOptions)
//     .then(gotDescription1Local, onCreateSessionDescriptionError)

//   window.localStream.getTracks().forEach(track => pc2Local.addTrack(track, window.localStream))
//   console.log('Adding local stream to pc2Local')
//   pc2Local.createOffer(offerOptions)
//     .then(gotDescription2Local, onCreateSessionDescriptionError)
// }

// function onCreateSessionDescriptionError (error) {
//   console.log(`Failed to create session description: ${error.toString()}`)
// }

// function gotDescription1Local (desc) {
//   pc1Local.setLocalDescription(desc)
//   console.log(`Offer from pc1Local\n${desc.sdp}`)
//   pc1Remote.setRemoteDescription(desc)
//   // Since the 'remote' side has no media stream we need
//   // to pass in the right constraints in order for it to
//   // accept the incoming offer of audio and video.
//   pc1Remote.createAnswer().then(gotDescription1Remote, onCreateSessionDescriptionError)
// }

// function gotDescription1Remote (desc) {
//   pc1Remote.setLocalDescription(desc)
//   console.log(`Answer from pc1Remote\n${desc.sdp}`)
//   pc1Local.setRemoteDescription(desc)
// }

// function gotDescription2Local (desc) {
//   pc2Local.setLocalDescription(desc)
//   console.log(`Offer from pc2Local\n${desc.sdp}`)
//   pc2Remote.setRemoteDescription(desc)
//   // Since the 'remote' side has no media stream we need
//   // to pass in the right constraints in order for it to
//   // accept the incoming offer of audio and video.
//   pc2Remote.createAnswer().then(gotDescription2Remote, onCreateSessionDescriptionError)
// }

// function gotDescription2Remote (desc) {
//   pc2Remote.setLocalDescription(desc)
//   console.log(`Answer from pc2Remote\n${desc.sdp}`)
//   pc2Local.setRemoteDescription(desc)
// }

// function hangup () {
//   console.log('Ending calls')
//   pc1Local.close()
//   pc1Remote.close()
//   pc2Local.close()
//   pc2Remote.close()
//   pc1Local = pc1Remote = null
//   pc2Local = pc2Remote = null
//   hangupButton.disabled = true
//   callButton.disabled = false
// }

// function gotRemoteStream1 (e) {
//   if (video2.srcObject !== e.streams[0]) {
//     video2.srcObject = e.streams[0]
//     console.log('pc1: received remote stream')
//   }
// }

// function gotRemoteStream2 (e) {
//   if (video3.srcObject !== e.streams[0]) {
//     video3.srcObject = e.streams[0]
//     console.log('pc2: received remote stream')
//   }
// }

// function iceCallback1Local (event) {
//   handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local')
// }

// function iceCallback1Remote (event) {
//   handleCandidate(event.candidate, pc1Local, 'pc1: ', 'remote')
// }

// function iceCallback2Local (event) {
//   handleCandidate(event.candidate, pc2Remote, 'pc2: ', 'local')
// }

// function iceCallback2Remote (event) {
//   handleCandidate(event.candidate, pc2Local, 'pc2: ', 'remote')
// }

// function handleCandidate (candidate, dest, prefix, type) {
//   dest.addIceCandidate(candidate)
//     .then(onAddIceCandidateSuccess, onAddIceCandidateError)
//   console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : '(null)'}`)
// }

// function onAddIceCandidateSuccess () {
//   console.log('AddIceCandidate success.')
// }

// function onAddIceCandidateError (error) {
//   console.log(`Failed to add ICE candidate: ${error.toString()}`)
// }

const socket = window.io()

var divSelectRoom = document.querySelector('#selectRoom')
var divConsoultingRoom = document.querySelector('#consoultingRoom')
var inputRoomNumber = document.querySelector('#roomNumber')
var btnGoRoom = document.querySelector('#goRoom')
var localVideo = document.querySelector('#localVideo')
var remoteVideo = document.querySelector('#remoteVideo')
var remoteVideo1 = document.querySelector('#remoteVideo1')

var roomNumber
var localStream
var remoteStream
var remoteStream1
var rtcPeerConnection = []
var iceServers = {
  iceServers: [
    { url: 'stun:stun.services.mozilla.com' },
    { url: 'stun:stun.l.google.com:19302' }
  ]
}

var streamConstraints = { audio: true, video: true }
var isCaller

// const socket = io()

btnGoRoom.onclick = function () {
  if (inputRoomNumber.value === '') {
    alert('Pleas type a room nr')
  } else {
    roomNumber = inputRoomNumber.value
    socket.emit('create or join', roomNumber)
    divSelectRoom.style = 'display: none'
    divConsoultingRoom.style = 'display: block'
  }
}

socket.on('created', function (room) {
  navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
    localStream = stream
    // localVideo.src = window.URL.createObjectURL(stream)
    localVideo.srcObject = stream
    isCaller = true
  }).catch(function (err) {
    console.log('error' + err)
  })
})

socket.on('joined', function (room) {
  navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
    localStream = stream
    // localVideo.src = URL.createObjectURL(stream)
    localVideo.srcObject = stream
    socket.emit('ready', roomNumber)
  }).catch(function (err) {
    console.log('error' + err)
  })
})

socket.on('ready', function () {
  if (isCaller) {
    rtcPeerConnection = new RTCPeerConnection(iceServers)
    rtcPeerConnection.onicecandidate = onIceCandidate
    rtcPeerConnection.onaddstream = onAddStream
    rtcPeerConnection.onaddstream = onAddStream1
    rtcPeerConnection.addStream(localStream)
    rtcPeerConnection.createOffer(setLocalAndOffer, function (e) {
      console.log(e)
    })
  }
})

socket.on('offer', function (event) {
  if (!isCaller) {
    rtcPeerConnection = new RTCPeerConnection(iceServers)
    rtcPeerConnection.onicecandidate = onIceCandidate
    rtcPeerConnection.onaddstream = onAddStream
    rtcPeerConnection.onaddstream = onAddStream1
    rtcPeerConnection.addStream(localStream)
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
    rtcPeerConnection.createAnswer(setLocalAndAnswer, function (e) {
      console.log(e)
    })
  }
})

socket.on('answer', function (event) {
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
})

socket.on('candidate', function (event) {
  var candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate

  })
  rtcPeerConnection.addIceCandidate(candidate)
})

function onAddStream (event) {
  // remoteVideo.src = URL.createObjectURL(event.stream)
  remoteVideo.srcObject = event.stream
  remoteStream = event.stream
}
function onAddStream1 (event) {
  // remoteVideo.src = URL.createObjectURL(event.stream)
  remoteVideo1.srcObject = event.stream
  remoteStream1 = event.stream
}

function onIceCandidate (event) {
  if (event.candidate) {
    console.log('sending ice candidate')
    socket.emit('candidate', {
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
      room: roomNumber

    })
  }
}

function setLocalAndOffer (sessionDescription) {
  rtcPeerConnection.setLocalDescription(sessionDescription)
  socket.emit('offer', {
    type: 'offer',
    sdp: sessionDescription,
    room: roomNumber
  })
}

function setLocalAndAnswer (sessionDescription) {
  rtcPeerConnection.setLocalDescription(sessionDescription)
  socket.emit('answer', {
    type: 'answer',
    sdp: sessionDescription,
    room: roomNumber
  })
}
