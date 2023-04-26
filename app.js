const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const phonesRouter = require("./controllers/phones");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

app.use("/api/persons", phonesRouter);

app.use(middleware.errorHandler);

module.exports = app;
