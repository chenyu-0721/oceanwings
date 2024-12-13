const mongoose = require('mongoose')

const userCouponSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // 關聯
			required: true,
		},
		discount_code_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'coupon',
			required: true,
		},
		used: {
			type: Boolean,
			default: false,
		},
		redeemed_at: {
			type: Date,
			default: null,
		},
		used_at: {
			type: Date,
			default: null,
		},
	},
	{ versionKey: false },
)

const UserCoupon = mongoose.model('UserCoupon', userCouponSchema)

module.exports = UserCoupon
