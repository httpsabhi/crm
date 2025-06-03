/**
 * @swagger
 * components:
 *   schemas:
 *     Rule:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *           description: Field name to apply the rule on
 *         operator:
 *           type: string
 *           description: Operator for the rule (e.g., equals, greaterThan)
 *         value:
 *           type: string
 *           description: Value to compare the field against
 *     Campaign:
 *       type: object
 *       required:
 *         - segmentName
 *         - message
 *         - rules
 *       properties:
 *         segmentName:
 *           type: string
 *           description: Name of the customer segment
 *         description:
 *           type: string
 *           description: Description of the campaign
 *         message:
 *           type: string
 *           description: Message template with placeholders
 *         rules:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rule'
 *           description: Rules to define the target audience
 *         audienceSize:
 *           type: integer
 *           description: Number of customers targeted
 *     CommunicationLog:
 *       type: object
 *       properties:
 *         campaign:
 *           type: string
 *           description: ID of the campaign
 *         customer:
 *           type: string
 *           description: ID of the customer
 *         status:
 *           type: string
 *           description: Delivery status (e.g., delivered, failed)
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Time of the communication
 */

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags:
 *       - Campaigns
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campaign created and messages are being processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campaignId:
 *                   type: string
 *                   description: ID of the created campaign
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 count:
 *                   type: integer
 *                   description: Number of customers targeted
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Retrieve all campaigns
 *     tags:
 *       - Campaigns
 *     responses:
 *       200:
 *         description: List of all campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /campaigns/delivery-receipt:
 *   post:
 *     summary: Log delivery status of a campaign message
 *     tags:
 *       - Campaigns
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - campaignId
 *               - status
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: ID of the customer
 *               campaignId:
 *                 type: string
 *                 description: ID of the campaign
 *               status:
 *                 type: string
 *                 description: Delivery status (e.g., delivered, failed)
 *     responses:
 *       200:
 *         description: Delivery status logged
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /campaigns/preview-audience:
 *   post:
 *     summary: Preview the number of customers matching the given rules
 *     tags:
 *       - Campaigns
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rules
 *             properties:
 *               rules:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Rule'
 *               logic:
 *                 type: string
 *                 description: Logical operator to combine rules (e.g., AND, OR)
 *     responses:
 *       200:
 *         description: Number of matching customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of customers matching the rules
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Retrieve communication logs for a specific campaign
 *     tags:
 *       - Campaigns
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the campaign
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Communication logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommunicationLog'
 *       500:
 *         description: Server error
 */

const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");

router.post("/", campaignController.createCampaign);
router.get("/", campaignController.getAllCampaigns);
router.post("/delivery-receipt", campaignController.handleDeliveryReceipt);
router.post("/preview", campaignController.previewAudience);
router.get("/:id", campaignController.getCampaignId);

module.exports = router;
