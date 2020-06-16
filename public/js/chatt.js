const socket = window.io()
// var Peer

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = document.querySelector('#username').value
console.log(name)
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage (message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}
// socket.on('message', function (message) {
//   console.log('The server has a message for you: ' + message)
// })
// // query DOM
// const message = document.getElementById('message')
// const handle = document.getElementById('handle')
// const button = document.getElementById('submit')
// const output = document.getElementById('output')

// // Emit events

// button.addEventListener('click', () => {
//   socket.emit('userMessage', {
//     handle: handle.value,
//     message: message.value
//   })
// })

// // Listen to events

// socket.on('userMessage', (data) => {
//   output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
// })
