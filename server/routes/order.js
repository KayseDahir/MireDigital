import express from "express";

import * as orderController from "../controllers/order.js";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.post("/cod", authUser, orderController.placeOrderCOD);
router.post("/online", authUser, orderController.placeOrderOnline);
router.get("/user", authUser, orderController.getUserOrders);
router.get("/admin", authAdmin, orderController.getAllOrders);
router.get("/admin/orders", authAdmin, orderController.getAdminOrders);
export default router;
