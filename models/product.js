const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const productSchema = new mongoose.Schema(
	{
		productId: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: '',
		},
		grade: {
			type: String,
			default: '',
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
			default: false,
		},
		hasDiscount: {
			type: Boolean,
			default: false,
		},
		imageUrl: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		length: {
			type: Number,
			default: '',
		},
		width: {
			type: Number,
			default: '',
		},
		thickness: {
			type: Number,
			default: '',
		},
		buoyancy: {
			type: Number,
			default: '',
		},
	},
	{ versionKey: false }, // 保留 `_id` 並禁用 `__v`
)

// 創建並導出模型
const Product = mongoose.model('Product', productSchema)
module.exports = Product
