import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    },
    status: { type: String, default: "order placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
