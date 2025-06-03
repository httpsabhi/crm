const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require('./config/redis');
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/campaigns", campaignRoutes);

app.get("/", (req, res) => {
  res.send("We are working fine!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
