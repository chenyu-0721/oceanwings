const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	discount: {
		type: Number,
		required: true,
		min: 0,
		max: 100,
	},
	quantity: {
		type: Number,
		required: true,
		min: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
})

const Coupon = mongoose.model('Coupon', couponSchema)

module.exports = Coupon
