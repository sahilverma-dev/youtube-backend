import multer from "multer";
import path from "path";

const TEMP_UPLOAD_DIR = path.join(__dirname, "public", "temp");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export { upload };
