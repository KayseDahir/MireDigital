import jwt from "jsonwebtoken";
//login admin : /api/admin/login

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.ADMIN_PASSWORD &&
      email === process.env.ADMIN_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
      return res
        .status(200)
        .json({ success: true, message: "Login successfully", successs: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// admin authentication middleware : /api/admin/auth

export const authAdmin = (req, res, next) => {
  const { adminToken } = req.cookies;

  if (!adminToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    return res.status(200).json({ success: true, message: "ok" });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

//admin logout : /api/admin/logout
export const adminLogout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
