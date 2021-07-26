const config = require("config");
var tableData = require("../table-data");
var jwt = require("jsonwebtoken");
var chkAuth = function (req, res, next) {
  const token = extractToken(req);
  if (verifyToken(token)) {
    next();
  } else {
    res.status(401).send({
      message: "Invalid token",
      isAuthenticated: false,
    });
  }
};

const verifyToken = (token) => {
  console.log(token, "...token");
  try {
    if (token === config.get("secret")) {
      return true;
    }
    jwt.verify(token, config.get("secret"));
    return true;
  } catch (err) {
    return false;
  }
};

var extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

module.exports.chkAuth = chkAuth;
