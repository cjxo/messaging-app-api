const jwt = require("jsonwebtoken");
const verifyJWTToken = (token) => {  
  try {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESS);
  } catch (err) {
    return null;
  }
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - no token provided." });
  }

  const decoded = verifyJWTToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized - invalid token." });
  }

  req.userId = decoded.userId;

  next();
};

module.exports = {
  verifyToken,
};
