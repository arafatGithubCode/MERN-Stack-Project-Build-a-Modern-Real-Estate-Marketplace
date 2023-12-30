import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();

const PORT = 3000;
dotenv.config();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("Mongo DB is connected"))
  .catch((err) => {
    console.log("MongoDB is not connected");
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`server is running at http:localhost:${PORT}!`);
});
