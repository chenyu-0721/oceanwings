const express = require('express')
const router = express.Router()
const ctrl_product = require('../controllers/ctrl_product')

router.get('/', ctrl_product.getProducts)

router.post('/', ctrl_product.addProduct)

router.patch('/:id', ctrl_product.editProduct)

router.delete('/:id', ctrl_product.deleteProduct)

module.exports = router
