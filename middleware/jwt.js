const jwt = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  let authHeader = req.headers["authorization"];

  if (authHeader) {
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.json({
        code: "401",
        message: "Token is required",
        data: {},
      });
    }

    await jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      if (err) {
        return res.json({
          code: "402",
          message: "Invalid Token.",
          data: {},
        });
      }
      next();
    });
  } else {
    return res.json({
      code: "400",
      message: "Header not found",
      data: {},
    });
  }
};

const generateAccessToken = (req, res, next) => {
  console.log(req, process.env.TOKEN_SECRET, process.env.JWT_EXPIRATION);
  let expiresIn = process.env.JWT_EXPIRATION
    ? process.env.JWT_EXPIRATION
    : "1d";
  let signOptions = {
    expiresIn: expiresIn,
  };

  return jwt.sign(req, process.env.TOKEN_SECRET, signOptions);
};

const generateRefreshToken = (req, res, next) => {
  let expiresIn = process.env.JWT_REFRESH_EXPIRATION
    ? process.env.JWT_REFRESH_EXPIRATION
    : "7d";
  let signOptions = {
    expiresIn: expiresIn,
  };
  return jwt.sign(req, process.env.REFRESH_TOKEN_SECRET, signOptions);
};

const authRefreshToken = (req, res, next) => {
  let verifyOptions = {
    issuer: "CMS Kereta Commuter Indonesia",
  };

  jwt.verify(
    req.header("refresh_token"),
    process.env.REFRESH_TOKEN_SECRET,
    verifyOptions,
    (err, data) => {
      if (err) {
        return res.json({
          code: "400",
          message: "Refresh Token is invalid. Please login!",
          data: {},
        });
      }

      next();
    }
  );
};

const generateAccessTokenAdmin = (req, res, next) => {
  console.log(req, process.env.TOKEN_SECRET_ADMIN, process.env.JWT_EXPIRATION);
  let expiresIn = process.env.JWT_EXPIRATION
    ? process.env.JWT_EXPIRATION
    : "1d";
  let signOptions = {
    expiresIn: expiresIn,
  };

  return jwt.sign(req, process.env.TOKEN_SECRET_ADMIN, signOptions);
};

const authTokenAdmin = async (req, res, next) => {
  let authHeader = req.headers["authorization"];

  if (authHeader) {
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.json({
        code: "401",
        message: "Token is required",
        data: {},
      });
    }

    await jwt.verify(token, process.env.TOKEN_SECRET_ADMIN, (err, data) => {
      if (err) {
        return res.json({
          code: "402",
          message: "Invalid Token.",
          data: {},
        });
      }
      next();
    });
  } else {
    return res.json({
      code: "400",
      message: "Header not found",
      data: {},
    });
  }
};

const generateRefreshTokenAdmin = (req, res, next) => {
  let expiresIn = process.env.JWT_REFRESH_EXPIRATION
    ? process.env.JWT_REFRESH_EXPIRATION
    : "7d";
  let signOptions = {
    expiresIn: expiresIn,
  };
  return jwt.sign(req, process.env.REFRESH_TOKEN_SECRET_ADMIN, signOptions);
};

const authRefreshTokenAdmin = (req, res, next) => {
  let verifyOptions = {
    issuer: "CMS Kereta Commuter Indonesia",
  };

  jwt.verify(
    req.header("refresh_token"),
    process.env.REFRESH_TOKEN_SECRET_ADMIN,
    verifyOptions,
    (err, data) => {
      if (err) {
        return res.json({
          code: "400",
          message: "Refresh Token is invalid. Please login!",
          data: {},
        });
      }

      next();
    }
  );
};

module.exports = {
  authToken,
  generateAccessToken,
  generateRefreshToken,
  authRefreshToken,
  generateAccessTokenAdmin,
  generateRefreshTokenAdmin,
  authRefreshTokenAdmin,
  authTokenAdmin,
};
