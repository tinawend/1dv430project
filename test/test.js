'use strict'
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

describe('find a correct user', function () {
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

describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      var user = new User({ username: 'Inger', password: 'password123' })
      user.save(done)
    })
  })
})
