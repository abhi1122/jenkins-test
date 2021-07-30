var express = require('express');
var router = express.Router();
const config = require("config");

/**
 * @swagger
 *
 * /:
 *   get:
 *     tags:
 *     - "Server details"
 *     summary: Get server status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Server status
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/appDetails'
 */
router.get('/', function (req, res, next) {
  res.send({
    status: 'up',
    app_name: config.get('app.name'),
    description: config.get('app.description'),
    version: config.get('app.version'),
  });
});

module.exports = router;


/**
 * @swagger
 *
 * definitions:
 *   appDetails:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: number
 *       images:
 *         type: string
 */