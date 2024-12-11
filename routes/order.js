const express = require('express')
const router = express.Router()
const ctrl_order = require('../controllers/ctrl_order')
const { isAuth } = require('../statusHandle/auth')

router.get('', isAuth, ctrl_order.getAllOrders)

router.get('/:id', isAuth, ctrl_order.getOrderById)

router.post('/checkout', isAuth, ctrl_order.checkout)

module.exports = router
