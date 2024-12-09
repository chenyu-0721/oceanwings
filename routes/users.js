const express = require('express')
const { isAuth } = require('../statusHandle/auth')
const ctrl_users = require('../controllers/ctrl_users')
const router = express.Router()

router.get('/', ctrl_users.getUser)

router.delete('/:id', ctrl_users.deleteUser)

router.post('/sign_up', ctrl_users.sign_up)

router.post('/sign_in', ctrl_users.sign_in)

router.get('/Cart', isAuth, ctrl_users.getcart)

router.post('/cart', isAuth, ctrl_users.addcart)

router.delete('/cart/:id', isAuth, ctrl_users.deleteCart)

router.put('/cart/:id', isAuth, ctrl_users.updateCart)

module.exports = router
