const express = require("express");
const router = express.Router();
const auth = require("../middleware/jwt");
const controller = require("../controller/auth.controller");

router.post("/register", controller.validate("register"), controller.register);

router.post("/login", controller.validate("login"), controller.login);

router.post(
  "/admin/register",
  controller.validate("register-admin"),
  controller.registerAdmin
);

router.post(
  "/admin/login",
  controller.validate("login"),
  controller.loginAdmin
);

router.get("/authtoken", auth.authTokenAdmin, controller.verifiedToken);

module.exports = router;
