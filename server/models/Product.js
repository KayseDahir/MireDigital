import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: Array, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
