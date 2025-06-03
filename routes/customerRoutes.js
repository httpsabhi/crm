/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - totalSpend
 *         - visits
 *         - lastVisit
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the customer
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the customer
 *         totalSpend:
 *           type: number
 *           format: float
 *           description: Total money spent by the customer
 *         visits:
 *           type: integer
 *           description: Number of visits made by the customer
 *         lastVisit:
 *           type: string
 *           format: date
 *           description: Date of the last visit

 *   responses:
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *               details:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     operationId: createCustomer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       202:
 *         description: Customer data enqueued for ingestion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 messageId:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     operationId: getCustomers
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Failed to fetch customers
 */

/**
 * @swagger
 * /customers/count:
 *   get:
 *     summary: Get total number of customers (cached)
 *     tags: [Customers]
 *     operationId: getCustomerCount
 *     responses:
 *       200:
 *         description: Number of customers and cache source
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 source:
 *                   type: string
 *       503:
 *         description: Error communicating with caching service
 *       500:
 *         description: Server error while fetching customer count
 */

/**
 * @swagger
 * /customers/bulk-upload:
 *   post:
 *     summary: Bulk upload customer data (CSV or JSON)
 *     tags: [Customers]
 *     operationId: bulkUpload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or JSON file containing customer records
 *     responses:
 *       202:
 *         description: Bulk data queued for processing
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
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /customers/today:
 *   get:
 *     summary: Get count of new customers added today
 *     tags: [Customers]
 *     operationId: getNewCustomersToday
 *     responses:
 *       200:
 *         description: Count of new customers today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 source:
 *                   type: string
 *       500:
 *         description: Failed to fetch new customers added today
 */

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const upload = require("../middlewares/multer");

router.post("/", customerController.createCustomer);
router.get("/", customerController.getCustomers);
router.get("/count", customerController.getCustomerCount);
router.post(
  "/bulk-upload",
  upload.single("file"),
  customerController.bulkUpload
);
router.get("/new-today", customerController.getNewCustomersToday);

module.exports = router;
