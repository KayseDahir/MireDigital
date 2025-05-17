import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";
import publicRoutes from "./routes/public.js";
import deliveryRoutes from "./routes/delivery.js";

import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhook } from "./controllers/order.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
];
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
// Serve static files from the 'uploads/' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Public routes
app.use("/api/public", publicRoutes);

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/delivery-man", deliveryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
