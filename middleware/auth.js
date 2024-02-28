const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or invalid");
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user = { role: "manager" }
    next();
  } catch (err) {
    res.status(302).json({ error: "Invalid token",token });
  }
};

module.exports = protect;
