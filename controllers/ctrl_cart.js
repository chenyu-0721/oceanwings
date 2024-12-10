const Cart = require('../models/cart')
const Product = require('../models/product')
const handleSuccess = require('../handleSuccess')
const handleError = require('../handleError')

exports.getCart = async (req, res, next) => {
	try {
		const userId = req.user._id
		const cart = await Cart.findOne({ userId }).populate('products.productId')

		if (!cart) {
			return handleError(res, '購物車為空或未找到')
		}

		handleSuccess(res, cart)
	} catch (err) {
		handleError(res, '取得購物車失敗')
	}
}

exports.addItemToCart = async (req, res, next) => {
	try {
		const userId = req.user._id
		const { productId, quantity } = req.body

		if (quantity <= 0) {
			return handleError(res, '數量必須大於 0')
		}

		const product = await Product.findById(productId)

		if (!product) {
			return handleError(res, '商品不存在')
		}

		// 檢查是否有足夠的庫存
		if (product.quantity < quantity) {
			return handleError(res, '庫存不足')
		}

		let cart = await Cart.findOne({ userId })

		if (!cart) {
			cart = new Cart({
				userId,
				products: [
					{
						productId,
						quantity,
					},
				],
			})
		} else {
			const productIndex = cart.products.findIndex(item => item.productId.toString() === productId.toString())

			if (productIndex > -1) {
				// 如果商品已經存在於購物車，計算新的總數量
				const newQuantity = cart.products[productIndex].quantity + quantity

				// 再次檢查總數量是否超過庫存
				if (product.stock < newQuantity) {
					return handleError(res, '超過可用庫存')
				}

				cart.products[productIndex].quantity = newQuantity
			} else {
				cart.products.push({
					productId,
					quantity,
				})
			}
		}

		// 減少商品庫存
		product.quantity -= quantity
		await product.save()

		// 保存或更新購物車
		await cart.save()

		handleSuccess(res, cart)
	} catch (err) {
		console.log(err)
		handleError(res, '新增商品至購物車失敗')
	}
}

exports.updateCart = async (req, res, next) => {
	try {
		const userId = req.user._id
		const { productId, quantity } = req.body // 取得請求中的 productId 和 quantity

		if (quantity <= 0) {
			return handleError(res, '數量必須大於 0')
		}

		const product = await Product.findById(productId)
		if (!product) {
			return handleError(res, '商品不存在')
		}

		let cart = await Cart.findOne({ userId })

		if (!cart) {
			// 如果用戶沒有購物車，創建一個新的購物車
			cart = new Cart({
				userId,
				products: [
					{
						productId,
						quantity,
					},
				],
			})
		} else {
			// 更新現有購物車
			const productIndex = cart.products.findIndex(item => item.productId.toString() === productId.toString())

			if (productIndex > -1) {
				// 如果商品已經存在於購物車，更新數量
				cart.products[productIndex].quantity = quantity
			} else {
				// 如果商品不存在於購物車，則新增商品
				cart.products.push({
					productId,
					quantity,
				})
			}
		}

		// 保存或更新購物車
		await cart.save()

		handleSuccess(res, cart)
	} catch (err) {
		handleError(res, '更新購物車失敗')
	}
}

exports.deleteItemFromCart = async (req, res, next) => {
	try {
		const userId = req.user._id
		const { productId } = req.params // 從請求路徑中取得 productId

		const cart = await Cart.findOne({ userId })

		if (!cart) {
			return handleError(res, '購物車不存在')
		}

		const productIndex = cart.products.findIndex(item => item.productId.toString() === productId.toString())

		if (productIndex === -1) {
			return handleError(res, '商品不在購物車中')
		}

		// 刪除商品
		cart.products.splice(productIndex, 1)

		// 保存更新後的購物車
		await cart.save()

		handleSuccess(res, cart)
	} catch (err) {
		handleError(res, '刪除商品失敗')
	}
}
