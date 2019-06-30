const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name field is required.']
	},
	email: {
		type: String,
		required: [true, 'Uid is required.']
	},
	password: {
		type: String,
		required: [true, 'Password is required.']
	},
	winning: {
		type: Number,
		required: true
	},
	kill: {
		type: Number,
		required: true
	}
})

const User = mongoose.model('user', UserSchema, 'UserData')

module.exports = User