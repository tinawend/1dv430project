const User = require('../models/users')
const authenticate = {}

authenticate.getregister = (req, res) => {
  const sessuser = req.session.user
  res.render('register', { title: 'register', sessuser })
}

authenticate.register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  })

  await newUser.save(error => {
    if (error) {
      req.session.flash = {
        message: 'Unavalible username'
      }
      res.redirect('/register')
      console.log(error)
    } else {
      req.session.flash = {
        message: 'Successfully created a user'
      }
      res.redirect('/')
    }
  })
}

authenticate.getLogin = (req, res) => {
  const sessuser = req.session.user
  res.render('index', { title: 'home', sessuser })
}

authenticate.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  const compare = await user.comparePassword(req.body.password)
  if (!user) {
    req.session.flash = {
      message: 'No access'
    }
    res.redirect('/')
  }

  if (user && compare) {
    req.session.user = user
    req.session.flash = {
      message: 'Success'
    }
    res.redirect('/profile')
  }
}

authenticate.logout = (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error)
    } else {
      res.clearCookie('sid')
      res.redirect('/')
    }
  })
}

module.exports = authenticate
