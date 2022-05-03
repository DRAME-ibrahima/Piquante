const mongoose = require('mongoose')
const pluginValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(pluginValidator)

module.exports = mongoose.model('User', userSchema)

