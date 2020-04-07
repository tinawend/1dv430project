const Profile = require('../models/profile')
const profileController = {}

profileController.getMyProfile = async (req, res) => {
  const sessuser = req.session.user
  const editprofile = await Profile.find({ username: req.session.user.username })
  const usersprofile = editprofile.map(profile => ({
    name: profile.name,
    age: profile.age,
    id: profile._id
  }))
  res.render('profile', { usersprofile, sessuser })
}

profileController.makeProfile = async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    age: req.body.age,
    username: req.session.user.username
  })

  await profile.save()
  req.session.flash = {
    message: 'A profile was created'
  }
  res.redirect('/profile')
}

profileController.editProfile = async (req, res) => {
  const sessuser = req.session.user
  console.log(req.params)
  const editprofile = await Profile.findOne({ _id: req.params.id, username: req.session.user.username })

  res.render('aboutMe', { id: editprofile.id, name: editprofile.name, age: editprofile.age, sessuser })
}

profileController.updateProfile = async (req, res) => {
  await Profile.findOneAndUpdate({ _id: req.params.id, username: req.session.user.username }, req.body)
  req.session.flash = {
    message: 'Successfully updated your profile!'
  }
  res.redirect('/profile')
}

module.exports = profileController
