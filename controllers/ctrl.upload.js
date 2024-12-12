const handleSuccess = require('../handleSuccess.js')
const handleError = require('../handleError.js')
const firebaseAdmin = require('../connection/firebase')
const bucket = firebaseAdmin.storage().bucket()
const { v4: uuidv4 } = require('uuid')

exports.uploadImage = async (req, res, next) => {
	const file = req.file
	const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`)
	const blobStream = blob.createWriteStream()

	blobStream.on('finish', () => {
		const config = {
			action: 'read', // 權限
			expires: '12-31-2500', // 網址的有效期限
		}

		blob.getSignedUrl(config, (err, imgUrl) => {
			handleSuccess(res, imgUrl)
		})
	})

	blobStream.on('error', err => {
		handleError(res, '上傳失敗')
		res.status(500).send('上傳失敗')
	})

	blobStream.end(file.buffer)
}
