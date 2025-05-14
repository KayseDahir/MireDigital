import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utilities/sendOtpEmail.js";

// Register user

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //save user with OTP and unverified status
    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      verified: false,
    });
    await user.save();

    // Send OTP to user's email
    await sendOtpEmail(email, otp);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// verify OTP Eendpoint : /api/user/verify-otp
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    //check if the OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    //Mark the user as verified and clear the OTP
    user.verified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. Your account is now active.",
    });
  } catch (error) {
    console.error("Error in verifyOtp controller:", error.message); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login user

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields." });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    //check if the user is verified
    if (!user.verified) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Please verify your account using the OTP sent to your email.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Successfully logged in.",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check isAuthenticated
export const isAuth = async (req, res, next) => {
  try {
    const userId = req.userId; // Set by authUser middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error in isAuth controller:", error.message); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout user
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
