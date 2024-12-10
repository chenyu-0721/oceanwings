const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const productSchema = new mongoose.Schema(
	{
		productId: {
			type: String,
			default: '', // 預設為空字串
		},
		name: {
			type: String,
			default: '', // 預設為空字串
		},
		type: {
			type: String,
			default: '', // 預設為空字串
		},
		grade: {
			type: String,
			default: '', // 預設為空字串
		},
		price: {
			type: Number,
			default: 0, // 預設為 0
		},
		quantity: {
			type: Number,
			default: 0, // 預設為 0
		},
		status: {
			type: Boolean,
			default: false, // 預設為 false
		},
		hasDiscount: {
			type: Boolean,
			default: false, // 預設為 false
		},
		imageUrl: {
			type: String,
			default: '', // 預設為空字串
		},
		description: {
			type: String,
			default: '', // 預設為空字串
		},
	},
	{ versionKey: false }, // 保留 `_id` 並禁用 `__v`
)

// 創建並導出模型
const Product = mongoose.model('Product', productSchema)
module.exports = Product
