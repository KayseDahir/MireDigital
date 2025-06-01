import e from "express";
import mongoose from "mongoose";
const { Schema } = mongoose;

const newsletterSchema = new Schema({
  email: { type: String, required: true, unique: true },
});
const NewsLetter = mongoose.model("Newsletter", newsletterSchema);
export default NewsLetter;