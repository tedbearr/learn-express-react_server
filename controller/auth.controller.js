const moment = require("moment");
const winston = require("../config/winstonLog");
const bcrypt = require("bcrypt");
const model = require("../model/auth.model");
const jwt = require("../middleware/jwt");
const { body, validationResult } = require("express-validator");
moment.locale("id");

const validate = (method) => {
  switch (method) {
    case "login": {
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
    case "register": {
      return [
        body("username").not().isEmpty().withMessage("Username is required!"),
        body("password")
          .not()
          .isEmpty()
          .withMessage("Password is required!")
          .isLength({ min: 6 })
          .withMessage("Password atleast 6 characters"),
        body("email")
          .not()
          .isEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Wrong email format"),
        body("phone")
          .not()
          .isEmpty()
          .withMessage("Phone number is required")
          .isLength({ min: 12 })
          .withMessage("At least 12 digits phone numbers"),
      ];
    }
    case "register-admin": {
      return [
        body("username").not().isEmpty().withMessage("Username is required!"),
        body("password")
          .not()
          .isEmpty()
          .withMessage("Password is required!")
          .isLength({ min: 6 })
          .withMessage("Password atleast 6 characters"),
        body("email")
          .not()
          .isEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Wrong email format"),
      ];
    }
  }
};

const register = async (req, res, next) => {
  try {
    let { username, password, email, phone } = req.body;
    let result = {};
    let tableName = "users";
    let key = "username";
    let args = username;

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

    let checkData = await model.checkData(tableName, key, args);
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
    let data = {
      username: username,
      password: hashPassword,
      email: email,
      phone: phone,
      status: "A",
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_by: null,
    };

    winston.log.info(`Processing Register : Inserting data`);
    insertResult = await model.insertData(tableName, data);

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
    let tableName = "users";
    let key = "username";
    let args = username;

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
    let checkData = await model.checkData(tableName, key, args);
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
    await model.insertToken(tableName, key, args, data);

    result = {
      code: "00",
      message: "Login success",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };

    return res.status(200).json(result);
  } catch (error) {
    winston.log.error(`Response Login : ${error.message}`);

    res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    let result = {};
    let tableName = "admin";
    let key = "username";
    let args = username;

    winston.log.info(`Request Add Admim : ${req.body}`);

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

    winston.log.info(`Processing add admin : Checking data admin...`);
    let checkData = await model.checkData(tableName, key, args);
    if (checkData) {
      result = {
        code: "400",
        message: "Account already exists!",
        data: {},
      };

      winston.log.warn(`Response Register Admin : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Register Admin : Encrypting password`);
    const saltRounds = 10;
    let salt = bcrypt.genSaltSync(saltRounds);
    let hashPassword = await bcrypt.hash(password, salt);
    let data = {
      username: username,
      password: hashPassword,
      email: email,
      status: "A",
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_by: null,
    };

    winston.log.info(`Processing Register : Inserting data`);
    insertResult = await model.insertData(tableName, data);

    result = {
      code: "00",
      message: "Register successfully, please login",
      data: insertResult.command,
    };

    winston.log.info(`Response Register : ${JSON.stringify(result)}`);

    return res.status(200).json(result);
  } catch (error) {
    winston.log.error(`Respose Add Admin : ${error.message}`);
    return res.status(200).json({
      code: "500",
      message: error.message,
      body: {},
    });
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    let result = {};
    let { username, password } = req.body;
    let tableName = "admin";
    let key = "username";
    let args = username;

    winston.log.info(`Request Login Admin : ${JSON.stringify(req.body)}`);
    const err = validationResult(req);
    if (!err.isEmpty()) {
      result = {
        code: "400",
        message: err.errors[0].msg,
        data: {},
      };

      winston.log.warn(`Response Login Admin : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Login Admin : Checking data login...`);
    let checkData = await model.checkData(tableName, key, args);
    if (!checkData) {
      result = {
        code: "400",
        message: "Account doesn't exists!",
        data: {},
      };

      winston.log.warn(`Response Login Admin : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Login Admin : Comparing password...`);
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

      winston.log.warn(`Response Login Admin : ${JSON.stringify(result)}`);

      return res.status(200).json(result);
    }

    winston.log.info(`Processing Login : Generating access token...`);
    let accessToken = await jwt.generateAccessTokenAdmin(req.body);

    winston.log.info(`Processing Login : Generating refresh token...`);
    let refreshToken = await jwt.generateRefreshTokenAdmin(req.body);

    winston.log.debug(
      `Processing Login : Inserting access token and refresh token...`
    );
    let data = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    await model.insertToken(tableName, key, args, data);

    result = {
      code: "00",
      message: "Login admin success",
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        username: checkData.username,
        id: checkData.id,
      },
    };

    return res.status(200).json(result);
  } catch (error) {
    winston.log.error(`Response Login Admin : ${error.message}`);

    res.status(200).json({
      code: "500",
      message: error.message,
      data: {},
    });
  }
};

const verifiedToken = async (req, res) => {
  return res.status(200).json({
    code: "00",
    message: "Token Verified",
    data: {},
  });
};

module.exports = {
  validate,
  register,
  login,
  registerAdmin,
  loginAdmin,
  verifiedToken,
};
