const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const { Support } = require("../handlers/v1/support");

const router = express.Router();
const upload = multer();
const supportHandler = new Support();

/**
 * @swagger
 *
 * /support/login:
 *   post:
 *     tags:
 *     - "Support"
 *     summary: Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: formData
 *         required: true
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully saved
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/supportList'
 */

router.post("/login", upload.none(), auth.chkAuth, async (req, res) => {
  const response = await supportHandler.login(req);
  res.status(response.status).send({
    ...response,
  });
});

/**
 * @swagger
 *
 * /support/get-support-team:
 *   get:
 *     tags:
 *     - "Support"
 *     summary: Get support team list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully get list
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/supportList'
 */
router.get(
  "/get-support-team",
  upload.none(),
  auth.chkAuth,
  async (req, res, next) => {
    const response = await supportHandler.supportList();
    res.send(response);
  }
);

/**
 * @swagger
 *
 * /support/get-support-qa:
 *   get:
 *     tags:
 *     - "Support"
 *     summary: Get QA list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully get list
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/QaList'
 */
router.get(
  "/get-support-qa",
  upload.none(),
  auth.chkAuth,
  async (req, res, next) => {
    const response = await supportHandler.getQa();
    res.send(response);
  }
);

module.exports = router;

/**
 * @swagger
 *
 * definitions:
 *   supportList:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: number
 *       images:
 *         type: string
 */

/**
 * @swagger
 *
 * definitions:
 *   QaList:
 *     type: object
 *     properties:
 *       qus:
 *         type: string
 *       ans:
 *         type: string
 */
