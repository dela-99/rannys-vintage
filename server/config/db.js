import mongoose from "mongoose";

let connectionPromise;

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  mongoose.set("strictQuery", true);

  connectionPromise = mongoose.connect(process.env.MONGO_URI);
  try {
    const conn = await connectionPromise;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}
