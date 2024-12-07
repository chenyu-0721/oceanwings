const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const productSchema = new mongoose.Schema(
	{
		_id: Number,
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
	{ versionKey: false, _id: false },
)

productSchema.plugin(AutoIncrement, {
	id: 'product_seq',
	inc_field: '_id',
})

const product = mongoose.model('Product', productSchema)
module.exports = product
