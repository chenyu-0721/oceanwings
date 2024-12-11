const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		totalPrice: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
			default: 'Pending',
		},
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

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
