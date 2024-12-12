const express = require('express')
const router = express.Router()
const multer = require('multer')
const ctrl_upload = require('../controllers/ctrl.upload')

const upload = multer({})

router.post('/image', upload.single('file'), ctrl_upload.uploadImage)

module.exports = router
