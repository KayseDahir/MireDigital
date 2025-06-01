import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const unifiedLogin = async (req, res) => {
  const { email, password } = req.body;

  // 1. Admin login (from .env)
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Admin Login successfully",
      user: { email, role: "admin" },
    });
  }

  // 2. User or DeliveryMan login (from DB)

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // For deliveryMan, you may want to skip verification cehck
  if (user.role !== "deliveryMan" && !user.verified) {
    return res.status(400).json({
      success: false,
      message: "Please verify your account using the OTP sent to your email.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const role = user.role || "user"; // Default to 'user' if role is not set
  const tokenPayload = { id: user._id, role, email: user.email };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // set different cookies for different roles so they can stay logged in at the same time

  let cookieName = "token";
  if (role === "deliveryMan") cookieName = "deliveryToken";
  if (role === "user") cookieName = "token";

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Login successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role,
    },
  });
};
