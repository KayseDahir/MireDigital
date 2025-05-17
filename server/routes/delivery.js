import express from "express";
import {
  deliveryManLogin,
  getLoggedInDeliveryMan,
  verifyDeliveryOtp,
} from "../controllers/delivery.js";
import { getMyAssignedOrders } from "../controllers/order.js";
import { authDeliveryMan } from "../middlewares/authDeliveryMan.js";

const router = express.Router();

router.post("/login", deliveryManLogin);
router.get("/assigned-orders", authDeliveryMan, getMyAssignedOrders);
router.get("/current", authDeliveryMan, getLoggedInDeliveryMan);
router.post("/verify-otp", authDeliveryMan, verifyDeliveryOtp);

export default router;
