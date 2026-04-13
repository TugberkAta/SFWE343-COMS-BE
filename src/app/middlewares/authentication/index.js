const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "your-secret-key-here";

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      return next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
