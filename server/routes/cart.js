import express from "express";
import authUser from "../middlewares/authUser.js";
import * as cartController from "../controllers/cart.js";

const router = express.Router();

router.post("/update", authUser, cartController.updateCart);

export default router;
