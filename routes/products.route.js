const express = require("express");
const router = express.Router();
const auth = require("../middleware/jwt");
const controller = require("../controller/product.controller");

router.post(
  "/insert",
  auth.authToken,
  controller.validate("insert"),
  controller.insertData
);

router.post(
  "/admin/insert",
  auth.authTokenAdmin,
  controller.validate("insert"),
  controller.insertData
);

router.get("/admin/get-all-data", auth.authTokenAdmin, controller.getAllData);

router.get(
  "/admin/get-specified-data/:id",
  auth.authTokenAdmin,
  controller.getSpecifiedData
);

router.put(
  "/admin/update/:id",
  auth.authTokenAdmin,
  controller.validate("insert"),
  controller.updateData
);

router.post("/admin/delete", auth.authTokenAdmin, controller.deleteData);
// router.post("/login", controller.validate("auth"), controller.login);

module.exports = router;
