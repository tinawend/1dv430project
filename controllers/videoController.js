const videoController = {}

videoController.getVideo = (req, res) => {
  const sessuser = req.session.user
  // const io = req.app.get('socketio')
  // io.emit('videoChat', req.body)
  res.render('videoChat', { title: 'video Chat', sessuser })
}

videoController.getText = (req, res) => {
  const sessuser = req.session.user
  res.render('textChat', { title: 'Chat with friends', sessuser })
}
module.exports = videoController
