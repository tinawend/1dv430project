const mongoose = require('mongoose')
const Schema = mongoose.Schema
const coverImageBasePath = 'uploads/bookCovers'

const profileSchema = new Schema({
  img: { data: Buffer, contentType: String },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  occupation: { type: String, required: true },
  username: { type: String }
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
module.exports.coverImageBasePath = coverImageBasePath
