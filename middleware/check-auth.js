const jwt = require("jsonwebtoken");

const jwtSecretKey = require("../util/keys").jwtSecretKey;
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.methods === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentocation failed!");
    }
    const decodedToken = jwt.verify(token, jwtSecretKey);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication Failed!", 403);
    return next(error);
  }
};
