import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import stripe from "stripe";
import User from "../models/User.js";
import Zone from "../models/Zone.js";
import { sendOtpEmail } from "../utilities/sendOtpEmail.js";
import { get } from "mongoose";
import getDateDaysAgo from "../helpers/getDateDaysAgo.js";

//place Order COD: /api/order/cod

export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address: addressId } = req.body;
    const userId = req.userId;
    console.log("Request Body:", req.body);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID is missing.",
      });
    }

    if (!addressId || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Address and items are required.",
      });
    }

    // Fetch the full address document
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Extract the zone from the address
    const zoneName = address.zone;
    console.log("Zone extracted from address:", zoneName);

    // Fetch the zone document by name
    const zoneDocument = await Zone.findOne({ name: zoneName });
    if (!zoneDocument) {
      return res.status(404).json({
        success: false,
        message: `Zone with name ${zoneName} not found.`,
      });
    }

    // Get the objectId of the zone
    const zoneId = zoneDocument._id;
    console.log("Zone ID:", zoneId);

    // Calculate the total amount based on the items and their quantities
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

    // Add a 2% service charge to the total amount
    amount += Math.floor(amount * 0.02);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Before deducting quantity, check if enough stock is available
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.inStock || product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${product.name}.`,
        });
      }
    }
    // Create the order
    const order = await Order.create({
      userId,
      items,
      amount,
      address: address._id,
      paymentType: "COD",
      status: "pending",
      zone: zoneName,
      otp,
    });

    //Deduct ordered quantity from the product stock
    for (const item of items) {
      const updateProduct = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );

      // If quantity is now 0, mark as out of stock
      if (updateProduct.quantity <= 0) {
        await Product.findByIdAndUpdate(item.product, { inStock: false });
      }
    }

    // Send OTP to the user
    const subject = "Delivery OTP";
    const text = `Dear ${address.firstName} ${address.lastName},

Thank you for shopping with MireDigital! Your order has been successfully placed. Below are the details of your order:

Order Number: ${order._id}
Items Ordered:
${items
  .map(
    (item, index) =>
      `${index + 1}. ${item.product.name} - Quantity: ${
        item.quantity
      } - Price: $${item.product.offerPrice}`
  )
  .join("\n")}

Total Amount: $${amount}
Payment Method: Cash on Delivery (COD)

Shipping Information:
Address: ${address.street}, ${address.city}, ${address.state}, ${
      address.country
    }, ${address.zipCode}
Estimated Delivery Date: ${new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toLocaleDateString()} (5 business days)

To confirm the successful delivery of your order, please provide the following OTP to the delivery person:

OTP: ${otp}

If you have any questions or concerns, please contact our support team.

Thank you for choosing MireDigital! We look forward to serving you again.

Best regards,  
MireDigital Support Team
`;
    await sendOtpEmail(address.email, subject, text);
    //
    res.status(200).json({
      success: true,
      message: "Order placed successfully .",
    });
  } catch (error) {
    console.log("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Place Order Online: /api/order/online

export const placeOrderOnline = async (req, res, next) => {
  try {
    const { items, address: addressId, paymentId } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    if (!addressId || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Address and items are required.",
      });
    }

    // Fetch the full address document
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Extract the zone from the address
    const zoneName = address.zone;
    const zoneDocument = await Zone.findOne({ name: zoneName });
    if (!zoneDocument) {
      return res.status(404).json({
        success: false,
        message: `Zone with name ${zoneName} not found.`,
      });
    }

    // Generate OTP for online payment
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let productData = [];

    // Check if address and items are provided
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found.`,
        });
      }
      productData.push({
        name: product.name,
        quantity: item.quantity,
        price: product.offerPrice,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Calculate the total amount based on the items and their quantities
    amount += Math.floor(amount * 0.02);
    // Add a 2% service charge to the total amount

    // Before deducting quantity, check if enough stock is available
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.inStock || product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${product.name}.`,
        });
      }
    }
    const order = await Order.create({
      userId,
      items,
      amount,
      address: address._id,
      paymentType: "Online",
      status: "pending",
      zone: zoneName,
      otp,
    });
    console.log("Online order created:", order);

    // Deduct ordered quantity from product stock
    for (const item of items) {
      const updateProduct = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );

      // If quantity is now 0, mark as out of stock
      if (updateProduct.quantity <= 0) {
        await Product.findByIdAndUpdate(item.product, { inStock: false });
      }
    }

    // Stripe Gateway initialization
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    //Create a line items for stripe
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    // Create a checkout session with Stripe
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Error placing online order:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Stripe webhooks to verify payment action from stripe : /stripe
export const stripeWebhook = async (req, res) => {
  console.log("Stripe webhook received!");
  // initialize stripe gateway
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  console.log("Stripe webhook called");
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Stripe event received:", event.type, event.id);
  } catch (error) {
    console.log("Error verifying stripe signature:", error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { orderId, userId } = session.metadata || {};

      if (orderId && userId) {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          status: "Delivered",
        });
        await User.findByIdAndUpdate(userId, { cartItems: {} });
        console.log(
          `Order ${orderId} marked as paid via checkout.session.completed`
        );
      } else {
        console.log(
          "Missing orderId or userId in session metadata",
          session.metadata
        );
      }
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const payementIntentId = paymentIntent.id;

      // Getting session metadata
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: payementIntentId,
      });

      const session = sessionList.data[0];
      if (!session) {
        console.log(
          "No Stripe session found for payment intent:",
          payementIntentId
        );
        break;
      }
      const { orderId, userId } = session.metadata;

      // Update the order status to "paid"
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        status: "Delivered",
      });
      // clear the user cart
      await User.findByIdAndUpdate(userId, { cartItems: {} });

      // Fetch order, address, and user details for email
      const order = await Order.findById(orderId);
      const address = order.address;
      const email = address.email;
      // Send OTP along with order confirmation email
      const subject = "Order Confirmation";
      const text = `Dear ${address.firstName} ${address.lastName},

Thank you for shopping with MireDigital! Your online payment was successful and your order has been placed.

Order Number: ${order._id}
Total Amount: $${order.amount}
Payment Method: Online Payment

Shipping Information:
Address: ${address.street}, ${address.city}, ${address.state}, ${
        address.country
      }, ${address.zipCode}
Estimated Delivery Date: ${new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toLocaleDateString()} (5 business days)

If you have any questions or concerns, please contact our support team.

Thank you for choosing MireDigital! We look forward to serving you again.

Best regards,  
MireDigital Support Team
`;
      await sendOtpEmail(email, subject, text);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const payementIntentId = paymentIntent.id;

      // Getting session metadata
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: payementIntentId,
      });
      const session = sessionList.data[0];
      if (!session) {
        console.log(
          "No Stripe session found for payment intent:",
          payementIntentId
        );
        break;
      }
      const { orderId, userId } = session.metadata;

      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  res.status(200).json({ received: true });
};

// Get Orders by User ID: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("User ID:", req.userId);

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
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });
    console.log("Orders Query Result:", orders);
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
      .populate("items.product")
      .populate("address")
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

// Get Orders for Admin with optional status filter: /api/admin/orders
export const getAdminOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) {
      query.status = status;
    }
    const orders = await Order.find(query)
      .populate("items.product")
      .populate("address")
      .populate("assignedTo")
      .sort({ createdAt: -1 });

    orders.forEach((order) => {
      console.log(
        `Order #${order._id} assignedTo:`,
        order.assignedTo
          ? `${order.assignedTo.name} (${order.assignedTo.email})`
          : "Not assigned"
      );
    });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("Error getting admin orders:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get the assigned order for the specific delivery ma : /api/delivery/getMyAssignedOrders
export const getMyAssignedOrders = async (req, res) => {
  try {
    const deliveryManId = req.deliveryMan._id; // <-- Use the ID from the middleware
    const orders = await Order.find({ assignedTo: deliveryManId })
      .populate("items.product")
      .populate("address")
      .populate("assignedTo")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("Error getting delivery man orders:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//Get order report : /api/report/orders?days=7
export const getOrderReport = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const fromDate = getDateDaysAgo(days);

    // Fetch orders in the time range
    const orders = await Order.find({ createdAt: { $gte: fromDate } })
      .populate("userId", "name email")
      .populate("items.product");

    // summary
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );
    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;
    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    // orders per day
    const ordersPerDayMap = {};
    const revenuePerDayMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(fromDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      ordersPerDayMap[key] = 0;
      revenuePerDayMap[key] = 0;
    }
    orders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 10);
      if (ordersPerDayMap[key] !== undefined) {
        ordersPerDayMap[key]++;
        revenuePerDayMap[key] += order.amount || 0;
      }
    });
    const ordersPerDay = Object.keys(ordersPerDayMap).map((date) => ({
      date,
      count: ordersPerDayMap[date],
    }));
    const revenuePerDay = Object.keys(revenuePerDayMap).map((date) => ({
      date,
      revenue: revenuePerDayMap[date],
    }));

    // Top products
    const productCount = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const name = item.product?.name || "Unknown";
        productCount[name] = (productCount[name] || 0) + item.quantity;
      });
    });
    const topProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Recent orders (last 10)
    const recentOrders = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map((order) => ({
        id: order._id,
        user: order.userId?.name || "Unknown",
        email: order.userId?.email || "Unknown",
        amount: order.amount,
        status: order.status,
        date: order.createdAt.toISOString().slice(0, 10),
      }));

    res.status(200).json({
      success: true,
      report: {
        totalOrders,
        totalRevenue,
        deliveredOrders,
        pendingOrders,
        ordersPerDay,
        revenuePerDay,
        topProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.log("Error getting order report:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
