const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cardProduct = require("./routes/cardProductRoutes");
const { logger } = require("./config/log");
const winstonLoki = require("./config/lokiWinstonLog");
const responseTime = require("response-time");
const lokiMiddleware = require("./middleware/lokiWinston");
const client = require("prom-client");
const register = new client.Registry();
const { count_metrics } = require("./config/metricsPrometheus");
const { promMiddleware } = require("./middleware/prometheus");
const redis = require("redis");
const redisMiddleware = require("./middleware/redis");

register.setDefaultLabels({ app: "learn-express-react" });
client.collectDefaultMetrics({ register });
register.registerMetric(count_metrics);

app.get("/metrics", (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  register.metrics().then((data) => res.send(data));
});

const port = process.env.PORT || 3009;

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(responseTime());

app.get("/", async (req, res) => {
  res.send("qq");
});

app.use(logger.request);
app.use(logger.response);

app.use(
  "/api/cardproduct",
  lokiMiddleware,
  promMiddleware,
  redisMiddleware,
  cardProduct
);

app.listen(port, () => {
  console.log(`Run at ${port} `);
});
