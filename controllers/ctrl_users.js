const User = require('../models/users')
const validator = require('validator')

const bcrypt = require('bcryptjs')
const appError = require('../statusHandle/appError')
const handleErrorAsync = require('../statusHandle/handleErrorAsync')
const handleSuccess = require('../handleSuccess.js')
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
		return next(appError(400, '請填寫所有必填欄位', next))
	}

	if (password !== confirmPassword) {
		return next(appError(400, '兩次輸入的密碼不一致', next))
	}

	if (!validator.isLength(password, { min: 8 })) {
		return next(appError(400, '密碼長度必須大於8個字元', next))
	}

	if (!validator.isEmail(email)) {
		return next(appError(400, '電子郵件格式不正確', next))
	}

	try {
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return next(appError(400, '此電子郵件已被註冊', next))
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const newUser = await User.create({
			email,
			password: hashedPassword,
			name,
			role: 'user',
			createdAt: new Date(),
		})

		handleSuccess(res, {
			message: '註冊成功',
			user: {
				id: newUser._id,
				name: newUser.name,
				email: newUser.email,
			},
		})
	} catch (error) {
		console.error('註冊失敗:', error)
		return next(appError(500, '伺服器錯誤，請稍後再試', next))
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
