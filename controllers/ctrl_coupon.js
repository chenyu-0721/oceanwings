const Coupon = require('../models/coupon.js')
const handleSuccess = require('../handleSuccess.js')
const handleError = require('../handleError.js')

exports.getCoupon = async (req, res, next) => {
	try {
		const page = parseInt(req.query.pase) || 1
		const limit = parseInt(req.query.limit) || 10

		const skip = (page - 1) * limit

		const totalItems = await Coupon.countDocuments()
		const coupons = await Coupon.find().skip(skip).limit(limit).exec()

		const totalPages = Math.ceil(totalItems / limit)

		const responseData = {
			data: coupons,
			meta: {
				totalItems,
				totalPages,
				currentPage: page,
			},
		}

		handleSuccess(res, responseData)
	} catch (error) {
		handleError(res, '折價券取得失敗')
	}
}

exports.addCoupon = async (req, res, next) => {
	try {
		const post = await Coupon.create(req.body)
		handleSuccess(res, post)
	} catch (error) {
		handleError(res, '建立失敗')
	}
}

exports.editCoupon = async (req, res, next) => {
	try {
		const putCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
		handleSuccess(res, putCoupon)
	} catch (error) {
		handleError(res, '編輯失敗')
	}
}

exports.deleteCoupon = async (req, res, next) => {
	try {
		const delpost = await Coupon.findByIdAndDelete(req.params.id)
		handleSuccess(res, delpost)
	} catch (error) {
		handleError(res, '刪除失敗')
	}
}
