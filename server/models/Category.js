import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
