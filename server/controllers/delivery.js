import User from "../models/User.js";
import Order from "../models/Order.js";
import Zone from "../models/Zone.js";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "../utilities/sendOtpEmail.js";
import jwt from "jsonwebtoken";

//Admin creates a delivery man
export const createDeliveryMan = async (req, res, next) => {
  try {
    const { name, email, password, zone } = req.body;

    const existingZone = await Zone.findOne({ name: zone });
    if (!existingZone) {
      return res.status(400).json({
        success: false,
        message: "Zone not found",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const deliveryMan = new User({
      name,
      email,
      password: hashedPassword,
      role: "deliveryMan",
      zone: existingZone._id,
    });

    await deliveryMan.save();

    res.status(200).json({
      success: true,
      message: "Delivery man created successfully",
    });
  } catch (error) {
    console.log("Error in createDeliveryMan controller:", error.message); // Debug log")
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Assign an order
export const assignOrderToDeliveryMan = async (req, res, next) => {
  try {
    const { orderId, deliveryManId } = req.body;

    //validate input
    if (!orderId || !deliveryManId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and Delivery Man ID are required",
      });
    }

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    //Fetch the delivery person
    const deliveryMan = await User.findById(deliveryManId);
    if (!deliveryMan) {
      return res.status(404).json({
        success: false,
        message: "Delivery man not found",
      });
    }
    // Fetch the zone document for the order's zone (if it's stored as a string)
    const orderZone = await Zone.findOne({ name: order.zone });
    if (!orderZone) {
      return res.status(400).json({
        success: false,
        message: "Order zone not found",
      });
    }

    // Check if the delivery man is in the same zone as the order
    if (deliveryMan.zone.toString() !== orderZone._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Delivery man is not in the same zone as the order",
      });
    }

    // Assign the order to the delivery man
    order.assignedTo = deliveryMan._id;
    order.status = "Shipped";
    order.otp =
      order.otp || Math.floor(100000 + Math.random() * 900000).toString();
    await order.save();
    // Send email notification to the delivery man
    const subject = "New Order Assigned";
    const text = `Hello ${deliveryMan.name},\n\nYou have been assigned a new order.\n\nOrder ID: ${order._id}\nZone: ${order.zone}\n\nPlease check your dashboard for more details.\n\nThank you.`;
    await sendOtpEmail(deliveryMan.email, subject, text);

    res.status(200).json({
      success: true,
      message: "Order assigned to delivery man successfully",
    });

    //
  } catch (error) {
    console.log("Error in assignOrderToDeliveryMan controller:", error.message); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDeliveryMen = async (req, res) => {
  try {
    const deliveryMen = await User.find({ role: "deliveryMan" })
      .select("name email zone")
      .populate("zone", "name"); // Fetch only relevant fields
    res.status(200).json({
      success: true,
      data: deliveryMen,
    });
  } catch (error) {
    console.error("Error fetching delivery men:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// create a zone
export const createZone = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if the zone already exists
    const existingZone = await Zone.findOne({ name });
    if (existingZone) {
      return res.status(400).json({
        success: false,
        message: "Zone already exists",
      });
    }

    const newZone = new Zone({
      name,
    });
    await newZone.save();
    res.status(201).json({
      success: true,
      message: "Zone created successfully",
      data: newZone,
    });

    //
  } catch (error) {
    console.log("Error in createZone controller:", error.message); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// get existing zones
export const getZones = async (req, res, next) => {
  try {
    const zones = await Zone.find();
    console.log("Fetched zones:", zones); // Debug log

    if (!zones || zones.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No zones found",
      });
    }

    res.status(200).json({
      success: true,
      data: zones,
    });

    //
  } catch (error) {
    console.log("Error in getZones controller:", error.message); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const verifyDeliveryOtp = async (req, res, next) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Mark the order as delivered
    order.status = "Delivered";
    order.isPaid = true;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order delivered successfully",
    });
  } catch (error) {
    console.log("Error in verifyDeliveryOtp controller:", error.message); // Debug log
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deliveryManLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);
    const user = await User.findOne({ email, role: "deliveryMan" }).populate(
      "zone",
      "name"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const deliveryToken = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token as HTTP-only cookie
    res.cookie("deliveryToken", deliveryToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        zone: user.zone.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in deliveryManLogin controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delivery man stay logged in
export const getLoggedInDeliveryMan = async (req, res, next) => {
  try {
    const user = await User.findById(req.deliveryMan._id).populate(
      "zone",
      "name"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        zone: user.zone.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error getting delivery man orders:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
