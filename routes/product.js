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

/**
 * @swagger
 * /product:
 *   post:
 *     summary: 新增商品
 *     description: 創建一個新的商品
 *     tags: [商品]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 商品名稱
 *                 example: "高質量耳機"
 *               price:
 *                 type: number
 *                 description: 商品價格
 *                 example: 299.99
 *               description:
 *                 type: string
 *                 description: 商品描述
 *                 example: "具有降噪功能的無線耳機"
 *               image:
 *                 type: string
 *                 description: 商品圖片 URL
 *                 example: "https://example.com/image.jpg"
 *               # 添加其他欄位根據你的需求
 *     responses:
 *       201:
 *         description: 成功創建商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 商品的唯一標識符
 *                     title:
 *                       type: string
 *                       description: 商品名稱
 *                     price:
 *                       type: number
 *                       description: 商品價格
 *                     description:
 *                       type: string
 *                       description: 商品描述
 *                     image:
 *                       type: string
 *                       description: 商品圖片 URL
 *                     # 根據商品模型添加其他欄位
 *       400:
 *         description: 無效請求，請檢查輸入的數據
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
 *                   example: 無效數據
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
 *                   example: 建立失敗
 */

router.post('/', async (req, res, next) => {
	try {
		const post = await Product.create(req.body)
		handleSuccess(res, post)
	} catch (err) {
		const error = '建立失敗'
		handleError(res, error)
	}
})

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: 更新商品
 *     description: 根據商品的 ID 更新其詳細信息
 *     tags: [商品]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品的唯一標識符
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 商品名稱
 *                 example: "更新後的耳機名稱"
 *               price:
 *                 type: number
 *                 description: 商品價格
 *                 example: 199.99
 *               description:
 *                 type: string
 *                 description: 商品描述
 *                 example: "更新後的商品描述"
 *               image:
 *                 type: string
 *                 description: 商品圖片 URL
 *                 example: "https://example.com/updated-image.jpg"
 *               # 根據商品模型添加其他可更新欄位
 *     responses:
 *       200:
 *         description: 成功更新商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 商品的唯一標識符
 *                     title:
 *                       type: string
 *                       description: 商品名稱
 *                     price:
 *                       type: number
 *                       description: 商品價格
 *                     description:
 *                       type: string
 *                       description: 商品描述
 *                     image:
 *                       type: string
 *                       description: 商品圖片 URL
 *                     # 根據商品模型添加其他欄位
 *       400:
 *         description: 無效的請求數據或 ID
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
 *                   example: 無效數據
 *       404:
 *         description: 找不到對應的商品
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
 *                   example: 商品不存在
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
 *                   example: 編輯失敗
 */

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

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: 刪除商品
 *     description: 根據商品的 ID 刪除一個商品
 *     tags: [商品]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品的唯一標識符
 *     responses:
 *       200:
 *         description: 成功刪除商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: 被刪除商品的唯一標識符
 *                     title:
 *                       type: string
 *                       description: 商品名稱
 *                     price:
 *                       type: number
 *                       description: 商品價格
 *                     description:
 *                       type: string
 *                       description: 商品描述
 *                     image:
 *                       type: string
 *                       description: 商品圖片 URL
 *                     # 根據商品模型添加其他欄位
 *       404:
 *         description: 找不到對應的商品
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
 *                   example: 商品不存在
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
 *                   example: 刪除單筆失敗
 */

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
