// models/users.js
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, '請輸入您的 Email'],
		unique: true,
		lowercase: true,
		select: false,
	},
	password: {
		type: String,
		required: [true, '請輸入密碼'],
		minlength: 8,
		select: false,
	},
	name: {
		type: String,
		required: [true, '請輸入名稱'],
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
	role: {
		type: String,
		default: 'user',
	},
})

const User = mongoose.model('user', userSchema)

module.exports = User
