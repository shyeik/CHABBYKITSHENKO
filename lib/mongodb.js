import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conncected to MONGODB");
  } catch (error) {
    console.log("Erro", error);
  }
};
