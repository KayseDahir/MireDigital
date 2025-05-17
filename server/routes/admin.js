import express from "express";
import { upload } from "../configs/multer.js";
import * as adminController from "../controllers/admin.js";
import * as categoryController from "../controllers/category.js";
import {
  createDeliveryMan,
  assignOrderToDeliveryMan,
  getDeliveryMen,
  createZone,
  getZones,
} from "../controllers/delivery.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

//Admin authentication routes
router.post("/login", adminController.adminLogin);
router.get("/is-Auth", authAdmin, adminController.authAdmin);
router.post("/logout", adminController.adminLogout);

// Category management routes
router.get("/categories", authAdmin, categoryController.getCategories);
router.post(
  "/add-category",
  upload.single("image"),
  authAdmin,
  categoryController.createCategory
);
router.delete(
  "/delete-category/:id",
  authAdmin,
  categoryController.deleteCategory
);

//Delivery Management routes
router.post("/create-delivery-man", authAdmin, createDeliveryMan);
router.post("/assign-order", authAdmin, assignOrderToDeliveryMan);
router.get("/delivery-men", authAdmin, getDeliveryMen);

// Zone management routes
router.post("/create-zone", authAdmin, createZone);
router.get("/zones", getZones);

export default router;
