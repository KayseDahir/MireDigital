import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryMan"],
      default: "user",
    },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    cartItems: { type: Object, default: {} },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", default: null },
  },
  { minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
