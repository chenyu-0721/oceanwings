const express = require('express')
const router = express.Router()
const ctrl_coupon = require('../controllers/ctrl_coupon')
const { isAuth } = require('../statusHandle/auth')

router.get('/', isAuth, ctrl_coupon.getCoupon)

router.post('/', isAuth, ctrl_coupon.addCoupon)

router.put('/:id', isAuth, ctrl_coupon.editCoupon)

router.delete('/:id', isAuth, ctrl_coupon.deleteCoupon)

module.exports = router
