import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: { type: String, required: true, ref: "user" },
  items: [
    {
      product: { type: String, required: true, ref: "product" },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: String, required: true, ref: "address" },
  status: { type: String, default: "order placed" },
  paymentType: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
},{timestamps: true});

const Order = mongoose.model("Order", orderSchema);
export default Order;
