const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
// const sizeOf = require('image-size')

const loggedIn = require('../middleware/middleware').isUserLoggedIn
const notSignedIn = require('../middleware/middleware').notAlreadyLogged
const authenticate = require('../controllers/signIncontroller')
const profile = require('../controllers/profileController')
const video = require('../controllers/videoController')

router.get('/videoChat', video.getVideo)

router.get('/register', notSignedIn, authenticate.getregister)

router.post('/register', notSignedIn, authenticate.register)

router.get('/', notSignedIn, authenticate.getLogin)

router.post('/', notSignedIn, authenticate.login)

router.post('/logout', loggedIn, authenticate.logout)

router.get('/profile', loggedIn, profile.getMyProfile)

router.post('/profile', loggedIn, profile.makeProfile)

router.get('/profile/aboutMe/:id', loggedIn, profile.editProfile)

router.post('/profile/aboutMe/:id', loggedIn, profile.updateProfile)

router.get('/profiles', profile.getUserProfiles)

router.post('/profiles', loggedIn, profile.searchProfiles)

router.get('/profiles/:id', loggedIn, profile.getUserProfile)

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    })
  }

  //   const dimensions = sizeOf(req.file.path)

  //   if ((dimensions.width < 640) || (dimensions.height < 480)) {
  //     return res.status(422).json({
  //       error: 'The image must be at least 640 x 480px'
  //     })
  //   }

  return res.status(200).send(req.file)
})

module.exports = router
