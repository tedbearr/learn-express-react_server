const moment = require("moment");
const winston = require("../../config/winstonLog");
const bcrypt = require("bcrypt");
const model = require("../../model/auth/auth.model");
const jwt = require("../../middleware/jwt");
const { body, validationResult } = require("express-validator");
moment.locale("id");

const validate = (method) => {
  switch (method) {
    case "auth": {
      return [
        body("username").not().isEmpty().withMessage("Username is required!"),
        body("password")
          .not()
          .isEmpty()
          .withMessage("Password is required!")
          .isLength({ min: 6 })
          .withMessage("Password atleast 6 characters"),
      ];
    }
  }
};

const register = async (req, res, next) => {
  try {
    let { username, password } = req.body;
    let result = {};

    winston.log.info(`Request register : ${JSON.stringify(req.body)}`);

    const err = validationResult(req);
    if (!err.isEmpty()) {
      result = {
        code: "400",
        message: err.errors[0].msg,
        data: {},
      };

      winston.log.warn(`Response Register : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Register : Checking data login`);

    let checkData = await model.checkDataRegister(username);
    if (checkData) {
      result = {
        code: "400",
        message: "Account with this username is already exists!",
        data: {},
      };

      winston.log.warn(`Response Register : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Register : Encrypting password`);
    const saltRounds = 10;
    let salt = bcrypt.genSaltSync(saltRounds);
    let hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);
    let data = {
      username: username,
      password: hashPassword,
      status: "A",
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_by: null,
    };

    winston.log.info(`Processing Register : Inserting data`);
    insertResult = await model.insertData(data);

    result = {
      code: "00",
      message: "Register successfully, please login",
      data: insertResult.command,
    };

    winston.log.info(`Response Register : ${JSON.stringify(result)}`);

    return res.status(200).json(result);
  } catch (error) {
    winston.log.error(`Response Register : ${JSON.stringify(error.message)}`);

    return res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

const login = async (req, res, next) => {
  try {
    let result = {};

    let { username, password } = req.body;

    winston.log.info(`Request Login : ${JSON.stringify(req.body)}`);

    const err = validationResult(req);
    if (!err.isEmpty()) {
      result = {
        code: "400",
        message: err.errors[0].msg,
        data: {},
      };

      winston.log.warn(`Response Register : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Login : Checking data login...`);

    let checkData = await model.checkDataRegister(username);
    if (!checkData) {
      result = {
        code: "400",
        message: "Account doesn't exists!",
        data: {},
      };

      winston.log.warn(`Response Login : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Login : Comparing password...`);

    let checkPassword = await bcrypt.compare(
      password,
      checkData.password.replace("$2y$", "$2a$")
    );

    if (!checkPassword) {
      result = {
        code: "403",
        message: "Wrong password",
        data: {},
      };

      winston.log.warn(`Response Login : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Login : Generating access token...`);
    let accessToken = await jwt.generateAccessToken(req.body);

    winston.log.info(`Processing Login : Generating refresh token...`);
    let refreshToken = await jwt.generateRefreshToken(req.body);

    winston.log.debug(
      `Processing Login : Inserting access token and refresh token...`
    );
    let data = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    await model.insertToken(username, data);

    result = {
      code: "00",
      message: "Login success",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };

    return res.status(200).json(result);
  } catch (error) {}
};

module.exports = {
  validate,
  register,
  login,
};
