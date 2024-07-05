const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.authorization || req.headers.Authorization;

  if (Authorization && Authorization.startsWith("Bearer ")) {
    const token = Authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new HttpError("Authorization token invalid.", 401));
      }

      req.user = user;
      next();
    });
  } else {
    return next(new HttpError("Authorization token required.", 401));
  }
};

module.exports = authMiddleware;
