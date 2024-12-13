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
	redeemCode: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
})

const Coupon = mongoose.model('Coupon', couponSchema)

module.exports = Coupon
