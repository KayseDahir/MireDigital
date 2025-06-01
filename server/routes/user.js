import express from "express";
import * as userController from "../controllers/user.js";
import * as categoryController from "../controllers/category.js";
import { unifiedLogin } from "../controllers/unifiedLogin.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/is-Auth", authUser, userController.isAuth);
router.post("/logout", authUser, userController.logout);
router.get("/categories", categoryController.getCategories);
router.post("/verify-otp", userController.verifyOtp);
router.post("/unified-login", unifiedLogin);
router.post("/send-reset-otp", userController.sendResetOtp);
router.post("/reset-password", userController.resetPassword);

export default router;
