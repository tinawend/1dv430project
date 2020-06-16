const User = require('../models/users')
// var assert = require('assert')
const mongoose = require('mongoose')
var expect = require('chai').expect

before('set up test-environment', function (done) {
  require('dotenv').config()
  mongoose.connect(`${process.env.DB_LINK}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  done()
})

describe('#find()', function () {
  it('responds with matching records', async function () {
    const users = await User.find()
    console.log(users.length)
    // return users.should.have.length(6)
    expect(users.length).to.equal(6)
  })
})

describe('#find()1', function () {
  it('should be correct sign in', async function () {
    const user = await User.findOne({ username: 'Gunnel' })
    if (!user) {
      expect(user.username).to.equal('Gunnel')
    }
    const compare = await user.comparePassword('lösenord')
    if (user && !compare) {
      expect(compare).to.equal(true)
      expect(user.username).to.equal('Gunnel')
    }

    if (user && compare) {
      expect(compare).to.equal(true)
      expect(user.username).to.equal('Gunnel')
    }
  })
})
