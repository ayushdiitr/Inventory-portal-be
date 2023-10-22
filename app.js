const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const globalErrorHandler = require("./Controller/errorController");
const authRouter = require("./Routes/authRoutes");
const itemRouter = require("./Routes/itemRoutes");
const logsRouter = require("./Routes/logsRoutes");
const AppError = require("./utils/appError");
const swaggerUi = require("swagger-ui-express");
dotenv.config();

const app = express();
// swagger config
const swaggerDoc = require("./swagger.json");

const allowList = [process.env.ALLOWED_URL_1, process.env.ALLOWED_URL_2];

var corsOptionsDelegate = function (req, callback) {
  var corsOptions = {
    credentials: true,
  };

  if (allowList.indexOf(req.header("Origin")) !== -1) {
    corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions.origin = false; // disable CORS for this request
  }

  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(express.json());
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors({ ...corsOptionsDelegate, methods: "*" }));

app.use("/test", (req, res) => {
  res.send("Working");
});

app.use(express.json({ limit: "8mb" }));

//All the routes comes here

app.get("/app/v1", (req, res, next) => {
  res.send("Test working");
});

app.use("/app/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/app/v1/auth", authRouter);
app.use("/app/v1/item", itemRouter);
app.use("/app/v1/logs", logsRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//This is the global error handler
app.use(globalErrorHandler);

module.exports = app;
