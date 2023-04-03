const client = require("prom-client");

const count_metrics = new client.Histogram({
  name: "cms",
  help: "this is the metric for getting request data based on code status",
  labelNames: [
    "route",
    "status_code",
    "issuer_name",
    "method",
  ],
});

module.exports = { count_metrics };
