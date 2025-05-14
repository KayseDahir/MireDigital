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
    verified: { type: Boolean, default: false },
    otp: { type: String },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
