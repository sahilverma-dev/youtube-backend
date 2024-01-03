import { Router } from "express";
import { uploadVideo } from "../controllers/videos.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

// normal routes

// secured routes
router.post(
  "/upload",
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnailFile",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

export const videosRouter = router;
