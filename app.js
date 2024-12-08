var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var productsRouter = require('./routes/product')

// Swagger 相關
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const port = process.env.PORT || 4000
var app = express()

// CORS 中間件
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next()
})

// Mongoose 連接
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(() => console.log('資料庫連接成功'))

// Swagger 配置
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Ocean-Wings',
			version: '1.0.0',
			description: 'API 文件',
		},
		servers: [
			{
				url: `http://localhost:${port}`,
			},
		],
	},
	apis: ['./swagger/*.js'], // 指定包含 API 路由的文件
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

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
app.use('/swagger/index.html', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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
