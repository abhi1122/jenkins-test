var express = require("express");
var jwt = require("jsonwebtoken");
var config = require("../config");
var tableData = require("../table-data");
var auth = require("../middleware/auth");
var router = express.Router();
var multer = require("multer");
var upload = multer();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

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

router.post("/login", upload.none(), auth.chkAuth, function (req, res, next) {
  console.log(req.body, "req body");
  const {
    supportTeam
  } = tableData;

  if (req.body.id && req.body.password) {
    let supportInfo = supportTeam.find((val) => val.id == req.body.id);
    console.log(supportInfo, req.body.password, '....supportInfo');
    if (supportInfo) {
      if (supportInfo.password === req.body.password) {
        const token = jwt.sign({
            id: supportInfo.id,
          },
          config.secret, {
            expiresIn: 86400,
          }
        );
        let support = {
          ...supportInfo
        };
        delete support.password;
        support['token'] = token;
        res.status(200).send({
          message: "login successfully",
          isAuthenticated: true,
          data: support,
        });
      } else {
        res.status(401).send({
          message: "Invalid login credentials!",
          isAuthenticated: false,
        });
      }
    } else {
      res.status(401).send({
        message: "Invalid login credentials!",
        isAuthenticated: false,
      });
    }
  } else {
    res.status(401).send({
      message: "Enter User Credentials!",
      isAuthenticated: false,
    });
  }
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
  (req, res, next) => {
    const support = JSON.parse(JSON.stringify(tableData.supportTeam));
    support.forEach(obj => delete obj.password);
    res.send(support);
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
  (req, res, next) => {
    res.send(tableData.QaTable);
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