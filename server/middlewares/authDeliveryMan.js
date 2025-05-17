import jwt from "jsonwebtoken";

export const authDeliveryMan = (req, res, next) => {
  const token = req.cookies.deliveryToken;
  console.log("Token in authDeliveryMan middleware:", token); // Debug log
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token in authDeliveryMan middleware:", decoded); // Debug log
    req.deliveryMan = { ...decoded, _id: decoded.id || decoded._id };
    next();
  } catch (error) {
    console.error("Error in authDeliveryMan middleware:", error.message); // Debug log
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
