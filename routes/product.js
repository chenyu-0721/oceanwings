const express = require('express')
const router = express.Router()
const Product = require('../models/product.js')
const handleSuccess = require('../handleSuccess.js')
const handleError = require('../handleError.js')

/**
 * @swagger
 * /product:
 *   get:
 *     summary: 取得所有商品
 *     description: 獲取系統中的所有商品列表
 *     tags: [商品]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 分頁頁碼（可選）
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 每頁顯示的商品數量（可選）
 *     responses:
 *       200:
 *         description: 成功取得商品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: 商品的唯一標識符
 *                       title:
 *                         type: string
 *                         description: 商品名稱
 *                       price:
 *                         type: number
 *                         description: 商品價格
 *                       description:
 *                         type: string
 *                         description: 商品描述
 *                       image:
 *                         type: string
 *                         description: 商品圖片 URL
 *                       # 根據您的商品模型添加其他欄位
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: 取得商品失敗
 */

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
