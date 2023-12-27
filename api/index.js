import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

const PORT = 3000;
dotenv.config();
mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("Mongo DB is connected"))
  .catch((err) => {
    console.log("MongoDB is not connected");
  });

app.listen(PORT, () => {
  console.log(`server is running at http:localhost:${PORT}!`);
});
