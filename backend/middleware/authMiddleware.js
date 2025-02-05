const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("Request Headers:", req.headers); // Log headers for debugging

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.error("No Authorization header found");
    return res.status(401).json({ error: "Authentication token is missing. Please log in." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Token missing after Bearer");
    return res.status(401).json({ error: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId || decoded.id }; // Ensure you use the correct property based on your token generation
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
