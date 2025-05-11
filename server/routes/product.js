import express from "express";
import * as productController from "../controllers/product.js";
import { upload } from "../configs/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.post(
  "/add",
  upload.array("image"),
  authAdmin,
  productController.addProduct
);
router.get("/list", productController.productList);
router.get("/id", productController.productById);
router.post("/update", authAdmin, productController.updateProduct);
router.post("/stock", authAdmin, productController.changeStock);
router.post("/delete", authAdmin, productController.deleteProduct);

export default router;
