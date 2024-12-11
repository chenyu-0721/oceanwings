const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const appError = require('../statusHandle/appError')
const handleErrorAsync = require('../statusHandle/handleErrorAsync')
const User = require('../models/users')

const generateSendJWT = (user, statusCode, res) => {
	// 產生 JWT token
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_DAY,
	})

	// 設置 HTTP-only cookie
	res.cookie('jwt', token, {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true, // 防止 XSS 攻擊
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict', // 防止 CSRF 攻擊
	})

	user.password = undefined // 清除密碼
	res.status(statusCode).json({
		status: 'success',
		user: {
			name: user.name,
			role: user.role,
		},
	})
}

const isAuth = handleErrorAsync(async (req, res, next) => {
	let token = req.cookies.jwt

	if (!token) {
		return next(appError(401, '你尚未登入！', next))
	}
	const decoded = await new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
			if (err) {
				reject(err)
			} else {
				resolve(payload)
			}
		})
	})

	const currentUser = await User.findById(decoded.id)

	if (!currentUser) {
		return next(appError(401, '此用戶不再存在！', next))
	}

	req.user = currentUser
	next()
})

const logout = res => {
	res.clearCookie('jwt', {
		httpOnly: true,
	})
}

module.exports = {
	isAuth,
	generateSendJWT,
	logout,
}
