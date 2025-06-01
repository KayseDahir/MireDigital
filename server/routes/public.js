import express from "express";
import { getZones } from "../controllers/delivery.js";
import { getOrderReport } from "../controllers/order.js";
const router = express.Router();

// Public route for fetching zones
router.get("/zones", getZones);
router.get("/orders-report", getOrderReport);

export default router;
