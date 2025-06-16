import { LoggerService } from "./logger.service";
import ResumeRepository from "../repositories/resume.repository";
import Resume from "../entities/resume.entity";

class ResumeService {
  private logger = LoggerService.getInstance(ResumeService.name);

  constructor(private resumeRepository: ResumeRepository) {}

  async saveResumeMetadata(file: Express.Multer.File): Promise<Resume> {
    const resume = new Resume();
    resume.filePath = file.filename;
    // Optionally set other fields if needed

    const createdResume = await this.resumeRepository.create(resume);

    this.logger.info(
      `Resume uploaded: ${file.originalname}, path: ${file.path}`
    );

    // Return the filename it's saved by (relative path)
    return createdResume;
  }
}

export default ResumeService;
