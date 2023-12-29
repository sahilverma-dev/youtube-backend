import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    console.log(
      "MongoDB connected on:".green,
      connectionInstance.connection.host.toString().blue
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ".red, error);
    process.exit(1);
  }
};

export default connectDB;
