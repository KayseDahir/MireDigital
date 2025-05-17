import express from "express";
import { getZones } from "../controllers/delivery.js";

const router = express.Router();

// Public route for fetching zones
router.get("/zones", getZones);

export default router;
