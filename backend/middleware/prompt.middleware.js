import jwt from "jsonwebtoken";
import config from "../config.js";
function userMiddleware(req, res, next) {
  const authheader = req.headers.authorization;
  if (!authheader || !authheader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authheader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default userMiddleware;
