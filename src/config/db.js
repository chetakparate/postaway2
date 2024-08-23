import mongoose from "mongoose";

const baseUrl = process.env.MONGODB || "0.0.0.0:27017"; // Use this to connect to local MongoDB + Compass
// const baseUrl = process.env.MongoDbAtlas; // Use this to connect to MongoDB Atlas

export const connectToDb = async () => {
  try {
    await mongoose.connect(`mongodb://${baseUrl}/postaway2`, {  // Use this to connect to local MongoDB + Compass
    // await mongoose.connect(`${baseUrl}`, { // // Use this to connect to MongoDB Atlas
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected using Mongoose");
  } catch (err) {
    console.log(err);
  }
};
