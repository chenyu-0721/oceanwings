const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
	{
		productId: {
			type: String,
			default: 0,
		},
		name: {
			type: String,
			default: 0,
		},
		type: {
			type: String,
			default: 0,
		},
		grade: {
			type: String,
			default: 0,
		},
		price: {
			type: Number,
			default: 0,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		status: {
			type: Boolean,
			default: 0,
		},
		hasDiscount: {
			type: Boolean,
			default: 0,
		},
		productId: {
			type: String,
			default: 0,
		},
		imageUrl: {
			type: String,
			default: 0,
		},
		description: {
			type: String,
			default: 0,
		},
	},
	{ versionKey: false },
)

const product = mongoose.model('Product', productSchema)
module.exports = product
