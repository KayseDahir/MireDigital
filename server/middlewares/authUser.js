import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken); // Debug log
    if (decodedToken.id) {
      req.userId = decodedToken.id; // Set userId for the next middleware
      console.log("req.userId:", req.userId);
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Token verification failed:", error.message); // Debug log
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authUser;
