import User from "../models/User.js"; // Import the User model

// Update User CartData : /api/cart/update

export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body; // Extract userId and cartItems from the request body

    const user = await User.findByIdAndUpdate(userId, { cartItems });
    // Find the user by ID and update their cartItems
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // If the user is found, return a success response
    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
