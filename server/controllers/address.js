import Address from "../models/Address.js";
// Add Address : /api/address/add

export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    // Extract address details from the request body
    await Address.create({ ...address, userId });
    // Create a new address document in the database
    res
      .status(200)
      .json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    // Extract userId from the request body
    const addresses = await Address.find({ userId });
    // Find address documents in the database based on userId
    if (!addresses) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found." });
    }
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.log("Error getting address:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
