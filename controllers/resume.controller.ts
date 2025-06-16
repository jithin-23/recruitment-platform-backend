import { Request, Response, NextFunction, Router } from "express";
import multer from "multer";
import ResumeService from "../services/resume.service";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = "./uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Use original name with timestamp for uniqueness
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `resume-${uniqueSuffix}.${ext}`);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

class ResumeController {
  constructor(private resumeService: ResumeService, private router: Router) {
    // POST /upload
    router.post("/", upload.single("resume"), this.uploadResume.bind(this));
  }

  async uploadResume(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      // Save file and metadata using the service
      const resume = await this.resumeService.saveResumeMetadata(req.file);
      res.status(201).json(resume);
    } catch (error) {
      next(error);
    }
  }
}

export default ResumeController;
