import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected successfully`);
  } catch (error) {
    console.log("Error connecting to database:", error.message);
    process.exit(1);
    throw error;
  }
};
