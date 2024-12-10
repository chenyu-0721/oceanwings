const express = require('express')
const router = express.Router()
const ctrl_product = require('../controllers/ctrl_product')
const { isAuth } = require('../statusHandle/auth')

router.get('/', ctrl_product.getProducts)

router.post('/', isAuth, ctrl_product.addProduct)

router.patch('/:id', isAuth, ctrl_product.editProduct)

router.delete('/:id', isAuth, ctrl_product.deleteProduct)

module.exports = router
