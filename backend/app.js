var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var indexRouter = require("./src/routes/index");
var supportRouter = require("./src/routes/support");
var cors = require("cors");
var app = express();
var letsConnect = require("lets-connect-socket");
var userData = require("./src/table-data/index");

const config = require("config");

if (process.env.NODE_ENV !== 'test') {
  letsConnect.connect({
    users: userData.supportTeam,
    port: config.get("app.socketPort"),
  });
}

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

const options = {
  swaggerDefinition: {
    info: {
      title: config.get("app.name"),
      version: config.get("app.version"),
      description: config.get("app.description"),
    },
    host: config.get("app.host"),
    basePath: "/",
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  apis: ["./src/routes/*.js"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", indexRouter);
app.use("/support", supportRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err, "app error");
  // render the error page
  res.status(err.status || 500);
  res.send({
    message: "Sorry unable to connect to system!",
  });
});

module.exports = app;
