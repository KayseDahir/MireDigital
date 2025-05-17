import User from "../models/User.js";
import Order from "../models/Order.js";

export const findAndAssignedDeliveryMan = async (orderId, zoneId) => {
  try {
    // Find a delivery man for the zone
    const deliveryMan = await User.findOne({
      role: "deliveryMan",
      zone: zoneId,
    });

    if (!deliveryMan) {
      throw new Error("No delivery man available for this zone.");
    }

    console.log("Delivery Man found:", deliveryMan);
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found.");
    }

    // Ensure assignedOrders exists and is an array
    if (!deliveryMan.assignedOrders) {
      console.log(
        "assignedOrders is undefined. Initializing it as an empty array."
      );
      deliveryMan.assignedOrders = []; // Initialize if undefined
    }
    // Assign the order to the delivery man's assigned orders
    deliveryMan.assignedOrders.push(order._id);
    await deliveryMan.save();

    return { success: true, message: "Order shipped", deliveryMan, order };
  } catch (error) {
    console.log("Error in findAndAssignedDeliveryMan:", error.message);
    throw new Error("Internal server error");
  }
};
