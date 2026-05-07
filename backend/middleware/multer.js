import multer from "multer";
import fs from "fs";
import { TEMP_CHUNKS_DIR } from "../config/storagePaths.js";
import { UPLOAD_CONFIG } from "../config/uploadConfig.js";
// =============================
// IMAGE STORAGE (Memory)
// =============================

const imageStorage = multer.memoryStorage();

// =============================
// VIDEO STORAGE (Disk)
// =============================
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/videos";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// =============================
// CHUNK STORAGE (TEMP)
// =============================
if (!fs.existsSync(TEMP_CHUNKS_DIR)) {
  fs.mkdirSync(TEMP_CHUNKS_DIR, { recursive: true });
}
const chunkStorage = multer({ dest: TEMP_CHUNKS_DIR });

// =============================
// FILTERS
// =============================
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

const videoFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/webm", "video/quicktime"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid video format"), false);
};

// =============================
// EXPORTS
// =============================
export const multipleImageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: UPLOAD_CONFIG.IMAGE.MAX_SIZE },
}).array("files", UPLOAD_CONFIG.IMAGE.MAX_COUNT);

export const multipleVideoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: UPLOAD_CONFIG.VIDEO.MAX_SIZE },
}).array("videos", UPLOAD_CONFIG.VIDEO.MAX_COUNT);

export const uploadChunk = chunkStorage.single("chunk");
