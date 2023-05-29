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
const auth = require("./routes/auth.route");
const products = require("./routes/products.route");
const mail = require("./routes/mail.route");
const https = require("https");
const fs = require("fs")

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
  res.send("qqa");
});

app.use(logger.request);
app.use(logger.response);

app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api", mail);

// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

app.listen(port, () => {
  console.log(`Run at ${port} `);
});

// https
//   .createServer(options, app)
//   .listen(port, console.log(`server runs on port ${port}`));
