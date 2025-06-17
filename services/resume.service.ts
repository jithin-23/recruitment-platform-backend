import { LoggerService } from "./logger.service";
import ResumeRepository from "../repositories/resume.repository";
import Resume from "../entities/resume.entity";
import { jobPostingService } from "../routes/jobposting.routes";
import fs from "fs";
import path from "path";
import axios from 'axios';

interface ScreeningResponse {
  resumeScore: number;
  skills: string;
}

class ResumeService {
  private logger = LoggerService.getInstance(ResumeService.name);
  // Expose repository for easy access if needed elsewhere, though not strictly required by this pattern
  public resumeRepository: ResumeRepository;

  constructor(resumeRepository: ResumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  async getResumeById(id: string | number): Promise<Resume | null> {
    return this.resumeRepository.findOneById(Number(id));
  }

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

  /**
   * Performs resume screening as a background, non-blocking task.
   * It is designed to be called without 'await'.
   * @param resumeId The ID of the resume to screen.
   * @param jobPostingId The ID of the job posting to screen against.
   */
  async screenResumeInBackground(resumeId: number, jobPostingId: number): Promise<void> {
    this.logger.info(`Starting background screening for resumeId: ${resumeId}`);
    try {
        const resume = await this.getResumeById(resumeId);
        const jobPosting = await jobPostingService.getJobPostingById(jobPostingId);

        if (!resume || !jobPosting) {
            throw new Error(`Resume or JobPosting not found for job context.`);
        }

        const filePath = path.join('./uploads', resume.filePath);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Resume file not found at path: ${filePath}`);
        }

        const form = new FormData();
        const fileContent = fs.readFileSync(filePath);
        form.append('resume', new Blob([fileContent]), resume.filePath);
        form.append('description', jobPosting.description);
        
        const screeningResponse = await axios.post<ScreeningResponse>(process.env.RESUME_SCREENING_SERVICE_URL, form);
        const { resumeScore, skills } = screeningResponse.data;
        
        await this.resumeRepository.updateScoreAndSkills(
            resume.id, 
            Math.round(resumeScore * 100), 
            skills
        );
        
        this.logger.info(`Successfully finished background screening for resumeId: ${resume.id}.`);

    } catch (error) {
        this.logger.error(`Background screening failed for resumeId: ${resumeId}. Error: ${error.message}`);
    }
  }
}

export default ResumeService;
