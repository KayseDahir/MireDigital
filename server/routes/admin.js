import express from "express";
import * as adminController from "../controllers/admin.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

router.post("/login", adminController.adminLogin);
router.get("/is-Auth", authAdmin, adminController.authAdmin);
router.post("/logout", adminController.adminLogout);

export default router;
