const express = require('express')
const router = express.Router()
const Product = require('../models/product.js')
const handleSuccess = require('../handleSuccess.js')
const handleError = require('../handleError.js')

router.get('/', async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10

		const skip = (page - 1) * limit

		const totalItems = await Product.countDocuments()

		const products = await Product.find().skip(skip).limit(limit)

		const totalPages = Math.ceil(totalItems / limit)

		const responseData = {
			data: products,
			meta: {
				totalItems,
				totalPages,
				currentPage: page,
			},
		}

		handleSuccess(res, responseData)
	} catch (err) {
		handleError(res, '取得商品失敗')
	}
})

router.post('/', async (req, res, next) => {
	try {
		const post = await Product.create(req.body)
		handleSuccess(res, post)
	} catch (err) {
		const error = '建立失敗'
		handleError(res, error)
	}
})

router.patch('/:id', async (req, res, next) => {
	try {
		const newpost = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		handleSuccess(res, newpost)
	} catch (err) {
		const error = '編輯失敗'
		handleError(res, error)
	}
})

router.delete('/:id', async (req, res, next) => {
	try {
		const delpost = await Product.findByIdAndDelete(req.params.id)
		handleSuccess(res, delpost)
	} catch (err) {
		const error = '刪除單筆失敗'
		handleError(res, error)
	}
})

module.exports = router
