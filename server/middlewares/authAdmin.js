import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  const { adminToken } = req.cookies;

  console.log("Cookies:", req.cookies);
  if (!adminToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decodedToken.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

export default authAdmin;
