import { Repository } from "typeorm";
import Resume from "../entities/resume.entity";

class ResumeRepository {
  constructor(private repository: Repository<Resume>) {}

  async create(resume: Resume): Promise<Resume> {
    return this.repository.save(resume);
  }

  async findMany(): Promise<Resume[]> {
    return this.repository.find({
      relations: {
        referral: true,
      },
    });
  }

  async findOneById(id: number): Promise<Resume | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        referral: true,
      },
    });
  }

  async update(id: number, resume: Partial<Resume>): Promise<void> {
    await this.repository.update(id, resume);
  }

  async updateScoreAndSkills(id: number, resumeScore: number, skills: string): Promise<void> {
   await this.repository.update(id, { resumeScore, skills });
  }
}

export default ResumeRepository;
