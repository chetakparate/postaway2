import dotenv from "dotenv";
import express from "express";

import userRouter from "./src/features/users/user.routes.js";
import postRouter from "./src/features/posts/post.routes.js";
import commentRouter from "./src/features/comments/comment.routes.js";
import likeRouter from "./src/features/likes/like.routes.js";
import otpRouter from "./src/features/otp/otp.routes.js"
import friendRouter from "./src/features/friendships/friendship.routes.js"

import cookieParser from "cookie-parser";
import { appLevelErrorHandlerMiddleware } from "./src/middlewares/errorHandler.js";
import { invalidRoutesHandlerMiddleware } from "./src/middlewares/invalidRoutes.middleware.js";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/", (req, res) => {
  res.json("Welcome to PostAway2!");
})

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/api/otp", otpRouter);
app.use("/api/friends", friendRouter);

app.use(appLevelErrorHandlerMiddleware);

// Unhandled routes
app.use(invalidRoutesHandlerMiddleware);

// Middleware to handle errors
app.use(appLevelErrorHandlerMiddleware);

export default app;
