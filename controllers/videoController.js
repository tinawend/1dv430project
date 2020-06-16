const videoController = {}

videoController.getVideo = (req, res) => {
  const sessuser = req.session.user
  // const io = req.app.get('socketio')
  // io.emit('videoChat', req.body)
  res.render('videoChat', { title: 'video Chat', sessuser })
}

module.exports = videoController
