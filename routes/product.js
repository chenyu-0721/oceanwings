const express = require('express')
const router = express.Router()
const product_controllers = require('../controllers/crtl_product.js')

router.get('/', product_controllers.getProducts)

router.post('/', product_controllers.addProduct)

router.patch('/:id', product_controllers.editProduct)

router.delete('/:id', product_controllers.deleteProduct)

module.exports = router
