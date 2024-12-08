/**
 * @swagger
 * /product:
 *   get:
 *     summary: 取得所有商品
 *     description: 獲取系統中的所有商品列表
 *     tags: [商品]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 分頁頁碼（可選）
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 每頁顯示的商品數量（可選）
 *     responses:
 *       200:
 *         description: 成功取得商品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: 商品的唯一標識符
 *                       name:
 *                         type: string
 *                         description: 商品名稱
 *                       type:
 *                         type: string
 *                         description: 商品類型
 *                       grade:
 *                         type: string
 *                         description: 商品等級
 *                       price:
 *                         type: number
 *                         description: 商品價格
 *                       quantity:
 *                         type: number
 *                         description: 商品數量
 *                       status:
 *                         type: boolean
 *                         description: 商品狀態
 *                       hasDiscount:
 *                         type: boolean
 *                         description: 是否有折扣
 *                       imageUrl:
 *                         type: string
 *                         description: 商品圖片 URL
 *                       description:
 *                         type: string
 *                         description: 商品描述
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       description: 總商品數
 *                     totalPages:
 *                       type: integer
 *                       description: 總頁數
 *                     currentPage:
 *                       type: integer
 *                       description: 當前頁碼
 *       500:
 *         description: 伺服器錯誤
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
 *                   example: 取得商品失敗
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: 建立新商品
 *     description: 在系統中新增一個商品
 *     tags: [商品]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: 商品的唯一標識符
 *               name:
 *                 type: string
 *                 description: 商品名稱
 *               type:
 *                 type: string
 *                 description: 商品類型
 *               grade:
 *                 type: string
 *                 description: 商品等級
 *               price:
 *                 type: number
 *                 description: 商品價格
 *               quantity:
 *                 type: number
 *                 description: 商品數量
 *               status:
 *                 type: boolean
 *                 description: 商品狀態
 *               hasDiscount:
 *                 type: boolean
 *                 description: 是否有折扣
 *               imageUrl:
 *                 type: string
 *                 description: 商品圖片 URL
 *               description:
 *                 type: string
 *                 description: 商品描述
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: 成功建立商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: 商品的唯一標識符
 *                     name:
 *                       type: string
 *                       description: 商品名稱
 *                     type:
 *                       type: string
 *                       description: 商品類型
 *                     grade:
 *                       type: string
 *                       description: 商品等級
 *                     price:
 *                       type: number
 *                       description: 商品價格
 *                     quantity:
 *                       type: number
 *                       description: 商品數量
 *                     status:
 *                       type: boolean
 *                       description: 商品狀態
 *                     hasDiscount:
 *                       type: boolean
 *                       description: 是否有折扣
 *                     imageUrl:
 *                       type: string
 *                       description: 商品圖片 URL
 *                     description:
 *                       type: string
 *                       description: 商品描述
 *       400:
 *         description: 驗證錯誤
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
 *                   example: 資料驗證失敗
 *       500:
 *         description: 伺服器錯誤
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
 *                   example: 建立失敗
 */

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: 更新特定商品
 *     description: 根據商品ID更新商品資訊
 *     tags: [商品]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要更新的商品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: 商品的唯一標識符
 *               name:
 *                 type: string
 *                 description: 商品名稱
 *               type:
 *                 type: string
 *                 description: 商品類型
 *               grade:
 *                 type: string
 *                 description: 商品等級
 *               price:
 *                 type: number
 *                 description: 商品價格
 *               quantity:
 *                 type: number
 *                 description: 商品數量
 *               status:
 *                 type: boolean
 *                 description: 商品狀態
 *               hasDiscount:
 *                 type: boolean
 *                 description: 是否有折扣
 *               imageUrl:
 *                 type: string
 *                 description: 商品圖片 URL
 *               description:
 *                 type: string
 *                 description: 商品描述
 *     responses:
 *       200:
 *         description: 成功更新商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: 商品的唯一標識符
 *                     name:
 *                       type: string
 *                       description: 商品名稱
 *                     type:
 *                       type: string
 *                       description: 商品類型
 *                     grade:
 *                       type: string
 *                       description: 商品等級
 *                     price:
 *                       type: number
 *                       description: 商品價格
 *                     quantity:
 *                       type: number
 *                       description: 商品數量
 *                     status:
 *                       type: boolean
 *                       description: 商品狀態
 *                     hasDiscount:
 *                       type: boolean
 *                       description: 是否有折扣
 *                     imageUrl:
 *                       type: string
 *                       description: 商品圖片 URL
 *                     description:
 *                       type: string
 *                       description: 商品描述
 *       404:
 *         description: 找不到商品
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
 *                   example: 商品不存在
 *       500:
 *         description: 伺服器錯誤
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
 *                   example: 編輯失敗
 */

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: 刪除特定商品
 *     description: 根據商品ID刪除單一商品
 *     tags: [商品]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要刪除的商品ID
 *     responses:
 *       200:
 *         description: 成功刪除商品
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: 已刪除商品的唯一標識符
 *                     name:
 *                       type: string
 *                       description: 已刪除商品的名稱
 *                     price:
 *                       type: number
 *                       description: 已刪除商品的價格
 *       404:
 *         description: 找不到商品
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
 *                   example: 商品不存在
 *       500:
 *         description: 伺服器錯誤
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
 *                   example: 刪除單筆失敗
 */
