const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  try {
    if (!authHeader) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("No Token Provided");
      error.statusCode = 401;
      throw error;
    }
    decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }
    if (!decodedToken.userId) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    next(err);
  }
};
