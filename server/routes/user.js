import express from "express";
import * as userController from "../controllers/user.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/is-Auth",authUser, userController.isAuth);
router.post("/logout", authUser, userController.logout);
export default router;
