const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // 關聯
			required: true,
		},
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product', // 關聯
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: [1, '數量不能小於 1'],
					default: 1,
				},
				addedAt: {
					type: Date,
					default: Date.now(),
				},
			},
		],
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		updatedAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{ versionKey: false },
)

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
