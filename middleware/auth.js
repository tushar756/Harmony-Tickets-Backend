const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
  try {
 
    const token = req.headers.authorization.split(" ")[1];
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user = { role: "manager" }
    next();
  } catch (err) {
    res.status(302).json({ error: "Invalid token" });
  }
};

module.exports = protect;
