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
    id: profile._id
  }))
  res.render('profile', { usersprofile, sessuser, profiles })
}

profileController.makeProfile = async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    age: req.body.age,
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

  res.render('aboutMe', { id: editprofile.id, name: editprofile.name, age: editprofile.age, sessuser, profiles })
}

profileController.updateProfile = async (req, res) => {
  await Profile.findOneAndUpdate({ _id: req.params.id, username: req.session.user.username }, req.body)
  req.session.flash = {
    message: 'Successfully updated your profile!'
  }
  res.redirect('/profile')
}

profileController.searchProfiles = async (req, res) => {
  // const oneProfiles = await Profile.findOne({ username: req.query.search })
  // console.log(req.body.search)
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
    // console.log(oneProfiles.username)
    // if (oneProfiles.username === req.params.id) {
    res.render('publicProf', { user: oneProfiles.username, name: oneProfiles.name, age: oneProfiles.age, profiles, sessuser })
  } catch (error) {
    // console.log(error)
    try {
      const oneUser = await User.findOne({ username: req.params.id })
      res.render('publicProf', { username: oneUser.username, sessuser })
    } catch (error) {
      // console.log(error)
      res.status(404).send('Not found')
    }
  }
  // } else {
  // }
}

module.exports = profileController
