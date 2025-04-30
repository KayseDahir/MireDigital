import express from "express";
import * as addressController from "../controllers/address.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/add", authUser, addressController.addAddress);
router.get("/get", authUser, addressController.getAddress);

export default router;
