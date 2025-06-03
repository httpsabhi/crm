/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer
 *         - products
 *         - orderAmount
 *         - orderDate
 *       properties:
 *         customer:
 *           type: string
 *           description: ID of the customer
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           description: List of product IDs
 *         orderAmount:
 *           type: number
 *           format: float
 *           description: Total amount of the order
 *         orderDate:
 *           type: string
 *           format: date
 *           description: Date the order was placed
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     operationId: createOrder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       202:
 *         description: Order received and queued for processing
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     operationId: getAllOrders
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders/bulk-upload:
 *   post:
 *     summary: Upload a file to bulk upload orders
 *     tags: [Orders]
 *     operationId: bulkUploadOrders
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or JSON file containing orders
 *     responses:
 *       202:
 *         description: Orders queued for background processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 queued:
 *                   type: integer
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const upload = require("../middlewares/multer");

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.post("/bulk-upload", upload.single("file"), orderController.bulkUpload);

module.exports = router;
