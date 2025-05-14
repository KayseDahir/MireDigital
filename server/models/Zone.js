import mongoose from "mongoose";
const { Schema } = mongoose;

const zoneSchema = new Schema({
  name: { type: String, required: true, unqiue: true },
});

export default mongoose.model("Zone", zoneSchema);
