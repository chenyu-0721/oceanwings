const express = require('express')
const router = express.Router()
const ctrl_cart = require('../controllers/ctrl_cart')
const { isAuth } = require('../statusHandle/auth')

router.get('/', isAuth, ctrl_cart.getCart)

router.post('/', isAuth, ctrl_cart.addItemToCart)

router.put('/', isAuth, ctrl_cart.updateCart)

router.delete('/', isAuth, ctrl_cart.deleteItemFromCart)

module.exports = router
