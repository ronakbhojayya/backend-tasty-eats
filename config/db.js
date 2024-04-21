import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://ronaktastyeats:idY1wv5lrKr6qcNE@tastyeatsdb.fahrgna.mongodb.net/food-app"
    )
    .then(() => {
      console.log("MongoDB Connected!");
    });
};
