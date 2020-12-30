const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied!" });
  }

  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: "Invalid token!" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ error: "Server Error" });
  }
};
