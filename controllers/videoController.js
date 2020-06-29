const videoController = {}

videoController.getVideo = (req, res) => {
  const sessuser = req.session.user
  res.render('videoChat', { title: 'video Chat', sessuser })
}

videoController.getText = (req, res) => {
  const sessuser = req.session.user
  res.render('textChat', { title: 'Chat with friends', sessuser })
}
module.exports = videoController
