const Cart = require('../models/cart')
const Order = require('../models/order')
const Product = require('../models/product')
const handleSuccess = require('../handleSuccess.js')
const mongoose = require('mongoose')

exports.getAllOrders = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || 10
	const skip = (page - 1) * limit

	const query = {}

	if (req.query.status) {
		query.status = req.query.status
	}

	if (req.user.role !== 'admin') {
		query.userId = req.user.id
	}

	const [orders, total] = await Promise.all([
		Order.find(query)
			.populate({
				path: 'items.productId',
				select: 'name imageUrl price',
			})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		Order.countDocuments(query),
	])

	const data = {
		total,
		page,
		totalPages: Math.ceil(total / limit),
		data: orders,
	}

	console.log(data)

	handleSuccess(res, data)
}

exports.getOrderById = async (req, res, next) => {
	const orderId = req.params.id

	const order = await Order.findById(orderId).populate({
		path: 'items.productId',
		select: 'name imageUrl price description',
	})

	// Check if order exists
	if (!order) {
		const error = new Error('Order not found')
		error.statusCode = 404
		throw error
	}

	// Check user permissions
	if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id) {
		const error = new Error('Not authorized to view this order')
		error.statusCode = 403
		throw error
	}

	handleSuccess(res, order)
}
exports.checkout = async (req, res, next) => {
	const userId = req.user.id

	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const cart = await Cart.findOne({ userId }).populate('products.productId')

		if (!cart || cart.products.length === 0) {
			return res.status(400).json({ message: '購物車是空的' })
		}

		for (let item of cart.products) {
			const product = item.productId
			if (product.quantity < item.quantity) {
				return res.status(400).json({
					message: `產品 ${product.name} 庫存不足`,
				})
			}
		}

		const order = new Order({
			userId,
			items: cart.products.map(item => ({
				productId: item.productId._id,
				price: item.productId.price,
				quantity: item.quantity,
			})),
			totalPrice: cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0),
		})

		for (let item of cart.products) {
			await Product.findByIdAndUpdate(item.productId._id, { $inc: { quantity: -item.quantity } }, { session })
		}

		await order.save({ session })

		cart.products = []
		await cart.save({ session })

		await session.commitTransaction()
		session.endSession()

		handleSuccess(res, order)
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		console.error('訂單處理錯誤:', error)
		res.status(500).json({ message: '無法送出訂單', error: error.message })
	}
}
