const express = require('express')
const router = express.Router()
const loggedIn = require('../middleware/middleware').isUserLoggedIn
const notSignedIn = require('../middleware/middleware').notAlreadyLogged
const authenticate = require('../controllers/signIncontroller')
const profile = require('../controllers/profileController')
const video = require('../controllers/videoController')

router.get('/videoChat', loggedIn, video.getVideo)

router.get('/textChat', loggedIn, video.getText)

router.get('/register', notSignedIn, authenticate.getregister)

router.post('/register', notSignedIn, authenticate.register)

router.get('/', authenticate.getLogin)

router.post('/', notSignedIn, authenticate.login)

router.post('/logout', loggedIn, authenticate.logout)

router.get('/profile', loggedIn, profile.getMyProfile)

router.post('/profile', loggedIn, profile.makeProfile)

router.get('/profile/aboutMe/:id', loggedIn, profile.editProfile)

router.post('/profile/aboutMe/:id', loggedIn, profile.updateProfile)

router.post('/profiles', profile.searchProfiles)

router.get('/profiles/:id', profile.getUserProfile)

module.exports = router
