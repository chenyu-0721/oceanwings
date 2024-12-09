const User = require('../models/users')
const validator = require('validator')

const bcrypt = require('bcryptjs')
const appError = require('../statusHandle/appError')
const handleErrorAsync = require('../statusHandle/handleErrorAsync')
const { generateSendJWT } = require('../statusHandle/auth')

exports.getUser = async (req, res, next) => {
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
}

exports.deleteUser = async (req, res, next) => {
	try {
		const userId = req.params.id

		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({
				status: 'error',
				message: '找不到指定的使用者',
			})
		}

		await User.findByIdAndDelete(userId)

		res.status(200).json({
			status: 'success',
			message: '使用者刪除成功',
		})
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: '無法刪除使用者',
			error: error.message,
		})
	}
}

exports.sign_up = handleErrorAsync(async (req, res, next) => {
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
})

exports.sign_in = handleErrorAsync(async (req, res, next) => {
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
})

exports.addcart = async (req, res, next) => {
	handleErrorAsync(async (req, res, next) => {
		const { image, title, price, quantity } = req.body

		try {
			const user = await User.findById(req.user.id)

			if (!user) {
				return res.status(404).json({ error: '使用者尚未登入' })
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
	})
}

exports.getcart = async (req, res, next) => {
	handleErrorAsync(async (req, res, next) => {
		try {
			const user = await User.findById(req.user.id)

			if (!user) {
				return res.status(404).json({ error: '使用者尚未登入' })
			}

			res.status(200).json({ cart: user.cart })
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: '伺服器錯誤' })
		}
	})
}

exports.deleteCart = async (req, res, next) => {
	try {
		const userId = req.user.id
		const id = req.params.id

		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ error: '使用者尚未登入' })
		}

		const itemIndex = user.cart.findIndex(item => item._id.toString() === id)

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
}

exports.updateCart = async (req, res, next) => {
	handleErrorAsync(async (req, res, next) => {
		const { image, title, price, quantity } = req.body
		const id = req.params.id

		try {
			const user = await User.findById(req.user.id)

			if (!user) {
				return res.status(404).json({ error: '使用者尚未登入' })
			}

			const item = user.cart.find(item => item._id.toString() === id)

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
	})
}
