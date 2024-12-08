var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var productsRouter = require('./routes/product')

const swaggerDocument = require('./swagger/swagger.json')

// Swagger 相關
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const port = process.env.PORT || 4000
var app = express()

// Mongoose 連接
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(() => console.log('資料庫連接成功'))

// cors
const corsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	credentials: true,
	optionsSuccessStatus: 200,
	maxAge: 3600,
}

app.use((req, res, next) => {
	const cors = require('cors')(corsOptions)

	cors(req, res, err => {
		if (err) {
			console.error('CORS Error:', {
				origin: req.get('origin'),
				method: req.method,
				errorMessage: err.message,
			})

			return res.status(403).json({
				status: 'error',
				message: 'Cross-Origin Request Blocked',
				details: 'The request origin is not allowed by CORS policy',
			})
		}
		next()
	})
})

// 視圖引擎設置
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 路由
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/product', productsRouter)

// Swagger UI 路由
app.use('/swagger/index.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// 404 處理
app.use(function (req, res, next) {
	next(createError(404))
})

// 錯誤處理
app.use(function (err, req, res, next) {
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	res.status(err.status || 500)
	res.render('error')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

module.exports = app
