const Profile = require('../models/profile')
const User = require('../models/users')

const profileController = {}

profileController.getMyProfile = async (req, res) => {
  const sessuser = req.session.user
  const allProfiles = await Profile.find({})
  const profiles = allProfiles.map(users => ({
    username: users.username
  }))
  const editprofile = await Profile.find({ username: req.session.user.username })
  const usersprofile = editprofile.map(profile => ({
    name: profile.name,
    age: profile.age,
    occupation: profile.occupation,
    id: profile._id
  }))
  res.render('profile', { usersprofile, sessuser, profiles })
}

profileController.makeProfile = async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    age: req.body.age,
    occupation: req.body.occupation,
    username: req.session.user.username

  })
  console.log(req.file)

  await profile.save()
  req.session.flash = {
    message: 'A profile was created'
  }
  res.redirect('/profile')
}

profileController.editProfile = async (req, res) => {
  const sessuser = req.session.user
  const allProfiles = await Profile.find({})
  const profiles = allProfiles.map(users => ({
    username: users.username
  }))
  console.log(req.params)
  const editprofile = await Profile.findOne({ _id: req.params.id, username: req.session.user.username })

  res.render('aboutMe', { id: editprofile.id, name: editprofile.name, age: editprofile.age, occupation: editprofile.occupation, sessuser, profiles })
}

profileController.updateProfile = async (req, res) => {
  await Profile.findOneAndUpdate({ _id: req.params.id, username: req.session.user.username }, req.body)
  req.session.flash = {
    message: 'Successfully updated your profile!'
  }
  res.redirect('/profile')
}

profileController.searchProfiles = async (req, res) => {
  res.redirect('/profiles/' + req.body.search)
}

profileController.getUserProfile = async (req, res) => {
  const sessuser = req.session.user
  const allProfiles = await Profile.find({})
  const profiles = allProfiles.map(users => ({
    username: users.username
  }))
  try {
    const oneProfiles = await Profile.findOne({ username: req.params.id })
    res.render('publicProf', { user: oneProfiles.username, name: oneProfiles.name, age: oneProfiles.age, occupation: oneProfiles.occupation, profiles, sessuser })
  } catch (error) {
    try {
      const oneUser = await User.findOne({ username: req.params.id })
      res.render('publicProf', { username: oneUser.username, sessuser })
    } catch (error) {
      res.status(404).send('Not found')
    }
  }
}

module.exports = profileController
