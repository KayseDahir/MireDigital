import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Rename file to avoid conflicts
  },
});

// Export the upload middleware
export const upload = multer({ storage });
