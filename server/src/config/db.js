import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Stop the app if the DB is required for it to function
  }
};

mongoose.connection.on("error", (err) => {
  console.error(` MongoDB internal error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn(" MongoDB disconnected. Attempting to reconnect...");
});