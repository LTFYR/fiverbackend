import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/userRoute.js";
import gigRouter from "./routers/gigRoute.js";
import messageRouter from "./routers/messageRoute.js";
import conversationRouter from "./routers/conversationRoute.js";
import orderRouter from "./routers/orderRoute.js";
import commentRouter from "./routers/commentRoute.js";
import authRouter from "./routers/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

mongoose.set("strictQuery", true);

const PORT = 8000;

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/comments", commentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", authRouter);

//errorHandler middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Error happened";

  return res.status(errorStatus).send(errorMessage);
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, console.log("Connected"));
  } catch (error) {
    console.log(error);
  }
};

start();
