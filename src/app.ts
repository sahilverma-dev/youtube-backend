import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./constants/envs";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import { userRouter } from "./router/user.routes";
import { videosRouter } from "./router/video.routes";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videosRouter);

export { app };
