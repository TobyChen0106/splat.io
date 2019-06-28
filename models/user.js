const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name field is required.']
	},
	uid: {
		type: String,
		required: [true, 'Uid is required.']
	},
	winning: {
		type: Number,
		required: true
	},
	losing: {
		type: Number,
		required: true
	}
})

const User = mongoose.model('user', UserSchema)

module.exports = User