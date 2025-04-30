import express from "express";
import * as adminController from "../controllers/admin.js";
import authAdmin from "../middlewares/authAdmin.js";
import * as categoryController from "../controllers/category.js";
import { upload } from "../configs/multer.js";

const router = express.Router();

router.post("/login", adminController.adminLogin);
router.get("/is-Auth", authAdmin, adminController.authAdmin);
router.post("/logout", adminController.adminLogout);

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

export default router;
