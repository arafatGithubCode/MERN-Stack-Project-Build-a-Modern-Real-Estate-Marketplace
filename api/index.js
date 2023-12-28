import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();

const PORT = 3000;
dotenv.config();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("Mongo DB is connected"))
  .catch((err) => {
    console.log("MongoDB is not connected");
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`server is running at http:localhost:${PORT}!`);
});
