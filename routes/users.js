const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const appError = require('../statusHandle/appError')
const handleErrorAsync = require('../statusHandle/handleErrorAsync')
const { isAuth, generateSendJWT } = require('../statusHandle/auth')
const User = require('../models/users')
const router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 獲取所有用戶
 *     tags:
 *       - user
 *     responses:
 *       200:
 *         description: 成功返回用戶列表
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
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *       500:
 *         description: 服務器錯誤
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
 */

router.get('/', async function (req, res, next) {
	try {
		// 從數據庫獲取用戶列表
		const users = await User.find({}).select('-password') // 排除密碼字段

		res.status(200).json({
			status: 'success',
			data: users,
		})
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: '無法獲取用戶列表',
			error: error.message,
		})
	}
})

/**
 * * 註冊
 */

/**
 * @swagger
 * /users/sign_up:
 *   post:
 *     summary: 用戶註冊
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: 註冊失敗
 */

router.post(
	'/sign_up',
	handleErrorAsync(async (req, res, next) => {
		let { email, password, confirmPassword, name } = req.body

		if (!email || !password || !confirmPassword || !name) {
			return next(appError(400, '請填寫所有必填', next))
		}

		if (password !== confirmPassword) {
			return next(appError(400, '密碼不一制', next))
		}

		if (!validator.isLength(password, { min: 8 })) {
			return next(appError(400, '密碼長度需大於8位數', next))
		}

		if (!validator.isEmail(email)) {
			return next(appError(400, 'Email 格是不正確', next))
		}

		try {
			const existingUser = await User.findOne({ email })
			if (existingUser) {
				return next(appError(400, '該 Email 已被註冊', next))
			}

			const hashedPassword = await bcrypt.hash(password, 12)

			const newUser = await User.create({
				email,
				password: hashedPassword,
				name,
				role: 'user',
				cart: [],
			})

			generateSendJWT(newUser, 201, res)
		} catch (error) {
			return next(appError(500, '註冊失敗，請稍後在試', next))
		}
	}),
)

/**
 *  * 登入
 */

/**
 * @swagger
 * /users/sign_in:
 *   post:
 *     summary: 用戶登入
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: 登入失敗
 */

router.post(
	'/sign_in',
	handleErrorAsync(async (req, res, next) => {
		const { email, password } = req.body
		if (!email || !password) {
			return next(appError(400, '帳號密碼不可為空', next))
		}
		const user = await User.findOne({ email }).select('+password')
		const auth = await bcrypt.compare(password, user.password)
		if (!auth) {
			return next(appError(400, '您的密碼不正確', next))
		}
		generateSendJWT(user, 200, res)
	}),
)

/**
 * @swagger
 * /users/cart:
 *   post:
 *     summary: 添加商品到購物車
 *     description: 為已登錄用戶的購物車添加商品，如果商品已存在則更新數量
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *             properties:
 *               image:
 *                 type: string
 *                 description: 商品圖片URL
 *                 example: "https://example.com/product-image.jpg"
 *               title:
 *                 type: string
 *                 description: 商品名稱
 *                 example: "智能手錶"
 *               price:
 *                 type: number
 *                 description: 商品單價
 *                 example: 199.99
 *               quantity:
 *                 type: number
 *                 description: 商品數量（默認為1）
 *                 default: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: 成功添加商品到購物車
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "商品已添加到購物車"
 *       404:
 *         description: 用戶未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "找不到該用戶"
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "伺服器錯誤"
 */

router.post(
	'/cart',
	isAuth,
	handleErrorAsync(async (req, res, next) => {
		const { image, title, price, quantity } = req.body

		try {
			const user = await User.findById(req.user.id)

			if (!user) {
				return res.status(404).json({ error: '找不到該用戶' })
			}

			// 查找是否已有同名商品
			const existingItem = user.cart.find(item => item.title === title)

			if (existingItem) {
				// 如果已存在，增加數量
				existingItem.quantity = (existingItem.quantity || 1) + (quantity || 1)
			} else {
				// 否則，添加新商品
				const newItem = {
					image: image,
					title: title,
					price: price,
					quantity: quantity || 1,
				}
				user.cart.push(newItem)
			}

			// 計算金額
			existingItem.price = existingItem.quantity * price

			await user.save()

			res.status(200).json({ message: '商品已添加到購物車' })
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: '伺服器錯誤' })
		}
	}),
)

/**
 * @swagger
 * /users/getCart:
 *   get:
 *     summary: 獲取用戶購物車內容
 *     description: 獲取已登錄用戶的購物車內容
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取購物車
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       image:
 *                         type: string
 *                         description: 商品圖片連結
 *                       title:
 *                         type: string
 *                         description: 商品標題
 *                       price:
 *                         type: number
 *                         description: 商品價格
 *                       quantity:
 *                         type: number
 *                         description: 商品數量
 *       404:
 *         description: 用戶未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 找不到該用戶
 *       500:
 *         description: 服務器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 服務器錯誤
 */

router.get(
	'/Cart',
	isAuth,
	handleErrorAsync(async (req, res, next) => {
		try {
			const user = await User.findById(req.user.id)

			if (!user) {
				return res.status(404).json({ error: '找不到該用戶' })
			}

			res.status(200).json({ cart: user.cart })
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: '伺服器錯誤' })
		}
	}),
)

/**
 * @swagger
 * /users/cart/{itemId}:
 *   delete:
 *     summary: 刪除購物車商品
 *     description: 從已登入使用者的購物車中刪除指定商品
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: 要刪除的商品 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功刪除購物車商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 商品已從購物車中刪除
 *       404:
 *         description: 使用者或商品未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: 找不到該用戶
 *                     - example: 找不到該商品
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 伺服器錯誤
 */

router.delete('/cart/:itemId', isAuth, async (req, res) => {
	try {
		const userId = req.user.id
		const itemId = req.params.itemId

		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ error: '找不到該用戶' })
		}

		const itemIndex = user.cart.findIndex(item => item._id.toString() === itemId)

		if (itemIndex === -1) {
			return res.status(404).json({ error: '找不到該商品' })
		}

		user.cart.splice(itemIndex, 1)
		await user.save()

		res.status(200).json({ message: '商品已從購物車中刪除' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: '伺服器錯誤' })
	}
})

// 編輯購物車資訊

/**
 * @swagger
 * /users/cart/{itemId}:
 *   put:
 *     summary: 更新購物車商品
 *     description: 更新已登入使用者購物車中指定商品的資訊
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: 要更新的商品 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: 商品圖片 URL（可選）
 *               title:
 *                 type: string
 *                 description: 商品標題（可選）
 *               price:
 *                 type: number
 *                 description: 商品價格（可選）
 *               quantity:
 *                 type: number
 *                 description: 商品數量（可選）
 *     responses:
 *       200:
 *         description: 成功更新購物車商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 商品資訊已更新
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       image:
 *                         type: string
 *                       title:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: number
 *       404:
 *         description: 使用者或商品未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: 找不到該用戶
 *                     - example: 找不到該商品
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 伺服器錯誤
 */

router.put(
	'/cart/:itemId',
	isAuth,
	handleErrorAsync(async (req, res, next) => {
		const { image, title, price, quantity } = req.body
		const itemId = req.params.itemId

		try {
			const user = await User.findById(req.user.id)

			if (!user) {
				return res.status(404).json({ error: '找不到該用戶' })
			}

			const item = user.cart.find(item => item._id.toString() === itemId)

			if (!item) {
				return res.status(404).json({ error: '找不到該商品' })
			}

			// 更新商品資訊
			if (image !== undefined) item.image = image
			if (title !== undefined) item.title = title
			if (price !== undefined) item.price = price
			if (quantity !== undefined) item.quantity = quantity

			await user.save()

			res.status(200).json({ message: '商品資訊已更新', cart: user.cart })
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: '伺服器錯誤' })
		}
	}),
)

module.exports = router
