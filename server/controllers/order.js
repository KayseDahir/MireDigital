import Order from "../models/Order.js";
import Product from "../models/Product.js";

//place Order COD: /api/order/cod

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    // Extract userId, items, and address from the request body
    if (!address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Address and items are required.",
      });
    }
    // Check if address and items are provided
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found.`,
        });
      }
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Calculate the total amount based on the items and their quantities
    amount += Math.floor(amount * 0.02);
    // Add a 2% service charge to the total amount
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      status: "order placed",
    });
    res.status(200).json({
      success: true,
      message: "Order placed successfully.",
    });
  } catch (error) {
    console.log("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get Orders by User ID: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Error getting user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get All Orders: /api/order/admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Error getting all orders:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
