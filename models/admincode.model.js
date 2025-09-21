import mongoose from "mongoose";

const adminCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("Admincodes", adminCodeSchema);
