const express = require('express')
const router = express.Router()
const ctrl_order = require('../controllers/ctrl_order')
const { isAuth } = require('../statusHandle/auth')

router.get('/', isAuth, ctrl_order.getAllOrders)

router.get('/user', isAuth, ctrl_order.getUserOrder)

router.post('/checkout', isAuth, ctrl_order.checkout)

router.post('/complete', isAuth, ctrl_order.completeOrder)

module.exports = router
