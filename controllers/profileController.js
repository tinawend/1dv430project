const Profile = require('../models/profile')

// const path = require('path')
// const uploadPath = path.join('public', Profile.coverImageBasePath)
// var multer = require('multer')
// const upload = multer({
//     dest:
// })

const profileController = {}

profileController.getMyProfile = async (req, res) => {
  const sessuser = req.session.user
  const allProfiles = await Profile.find({})
  const profiles = allProfiles.map(users => ({
    username: users.username
  }))
  const editprofile = await Profile.find({ username: req.session.user.username })
  const usersprofile = editprofile.map(profile => ({
    img: profile.img,
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

profileController.getUserProfiles = async (req, res) => {
  const allProfiles = await Profile.find({})
  const profiles = allProfiles.map(users => ({
    img: users.img,
    username: users.username,
    name: users.name,
    age: users.age

  }))
  res.render('publicProfile', { profiles })
}
profileController.searchProfiles = async (req, res) => {
  // const oneProfiles = await Profile.findOne({ username: req.query.search })
  console.log(req.body.search)
  res.redirect('/profiles/' + req.body.search)
}

profileController.getUserProfile = async (req, res) => {
  const sessuser = req.session.user
  const allProfiles = await Profile.find({})
  const profiles = allProfiles.map(users => ({
    username: users.username
  }))
  const oneProfiles = await Profile.findOne({ username: req.params.id })
  // const search = document.querySelector('#search').value
  // if (search === oneProfiles) {

  // }
  // const profiles = allProfiles.map(users => ({
  //   username: users.username,
  //   name: users.name,
  //   age: users.age,
  //   id: users.id

  // }))
  res.render('publicProf', { user: oneProfiles.username, name: oneProfiles.name, age: oneProfiles.age, profiles, sessuser })
}

module.exports = profileController
