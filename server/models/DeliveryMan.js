import mongoose from "mongoose";
const { Schema } = mongoose;

const deliveryManSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
  assignedOrders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] },
  ],
});

export default mongoose.model("DeliveryMan", deliveryManSchema);
