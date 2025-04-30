import express from "express";
import * as userController from "../controllers/user.js";
import * as categoryController from "../controllers/category.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/is-Auth", authUser, userController.isAuth);
router.post("/logout", authUser, userController.logout);
router.get("/categories", categoryController.getCategories);
export default router;
