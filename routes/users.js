const express = require('express')
const { isAuth } = require('../statusHandle/auth')
const ctrl_users = require('../controllers/ctrl_users')
const router = express.Router()

router.get('/', isAuth, ctrl_users.getUser)

router.delete('/:id', isAuth, ctrl_users.deleteUser)

router.post('/sign_up', ctrl_users.sign_up)

router.post('/sign_in', ctrl_users.sign_in)

router.post('/logout', ctrl_users.logout)

module.exports = router
