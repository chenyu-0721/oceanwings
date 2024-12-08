/**
 * @swagger
 * /users:
 *   get:
 *     summary: 獲取所有用戶
 *     tags:
 *       - 使用者
 *     responses:
 *       200:
 *         description: 成功返回用戶列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *       500:
 *         description: 服務器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /users/sign_up:
 *   post:
 *     summary: 用戶註冊
 *     tags: [使用者]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: 註冊失敗
 */

/**
 * @swagger
 * /users/sign_in:
 *   post:
 *     summary: 用戶登入
 *     tags: [使用者]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: 登入失敗
 */

/**
 * @swagger
 * /users/cart:
 *   post:
 *     summary: 添加商品到購物車
 *     description: 為已登錄用戶的購物車添加商品，如果商品已存在則更新數量
 *     tags:
 *       - 購物車
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *             properties:
 *               image:
 *                 type: string
 *                 description: 商品圖片URL
 *                 example: "https://example.com/product-image.jpg"
 *               title:
 *                 type: string
 *                 description: 商品名稱
 *                 example: "智能手錶"
 *               price:
 *                 type: number
 *                 description: 商品單價
 *                 example: 199.99
 *               quantity:
 *                 type: number
 *                 description: 商品數量（默認為1）
 *                 default: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: 成功添加商品到購物車
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "商品已添加到購物車"
 *       404:
 *         description: 用戶未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "使用者尚未登入"
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "伺服器錯誤"
 */

/**
 * @swagger
 * /users/Cart:
 *   get:
 *     summary: 獲取用戶購物車內容
 *     description: 獲取已登錄用戶的購物車內容
 *     tags: [購物車]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取購物車
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       image:
 *                         type: string
 *                         description: 商品圖片連結
 *                       title:
 *                         type: string
 *                         description: 商品標題
 *                       price:
 *                         type: number
 *                         description: 商品價格
 *                       quantity:
 *                         type: number
 *                         description: 商品數量
 *       404:
 *         description: 用戶未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 使用者尚未登入
 *       500:
 *         description: 服務器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 服務器錯誤
 */

/**
 * @swagger
 * /users/cart/{id}:
 *   delete:
 *     summary: 刪除購物車商品
 *     description: 從已登入使用者的購物車中刪除指定商品
 *     tags: [購物車]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 要刪除的商品 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功刪除購物車商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 商品已從購物車中刪除
 *       404:
 *         description: 使用者尚未登入
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: 使用者尚未登入
 *                     - example: 找不到該商品
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 伺服器錯誤
 */

// 編輯購物車資訊

/**
 * @swagger
 * /users/cart/{id}:
 *   put:
 *     summary: 更新購物車商品
 *     description: 更新已登入使用者購物車中指定商品的資訊
 *     tags: [購物車]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 要更新的商品 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: 商品圖片 URL（可選）
 *               title:
 *                 type: string
 *                 description: 商品標題（可選）
 *               price:
 *                 type: number
 *                 description: 商品價格（可選）
 *               quantity:
 *                 type: number
 *                 description: 商品數量（可選）
 *     responses:
 *       200:
 *         description: 成功更新購物車商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 商品資訊已更新
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       image:
 *                         type: string
 *                       title:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: number
 *       404:
 *         description: 使用者尚未登入
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: 使用者尚未登入
 *                     - example: 找不到該商品
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 伺服器錯誤
 */
