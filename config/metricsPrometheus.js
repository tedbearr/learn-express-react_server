const client = require("prom-client");

const count_metrics = new client.Histogram({
  name: "learn_express_react",
  help: "this is the metric for getting request data based on code status",
  labelNames: ["route", "status_code", "date", "month", "year"],
});

module.exports = { count_metrics };
