var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var indexRouter = require("./routes/index");
var supportRouter = require("./routes/support");
var cors = require("cors");
var app = express();
// var letsConnect = require('lets-connect');
var userData = require('./table-data/index');

// letsConnect.connect({
//   users: userData.supportTeam
// });
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
// app.use(bodyParser.json());



const options = {
  swaggerDefinition: {
    info: {
      title: "Let's Connect2222",
      version: '1.0.0',
      description: "Let's Connect api for all chat activity's",
    },
    host: 'localhost:3003',
    basePath: '/',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
  apis: ['./routes/*.js'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));




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
    message: "Sorry unable to connect to system!"
  });
});

module.exports = app;
