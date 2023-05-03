const express = require("express");
const router = express.Router();
const auth = require("../middleware/jwt");
const mail = require("../config/mail");

router.post("/sendmail", mail.sendEmail);

module.exports = router;
