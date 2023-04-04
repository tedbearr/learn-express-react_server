const express = require("express");
const router = express.Router();
const auth = require("../middleware/jwt");
const controller = require("../controller/auth/auth.controller");

router.post("/register", controller.validate("auth"), controller.register);

router.post("/login", controller.validate("auth"), controller.login);

module.exports = router;
