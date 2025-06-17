import { Repository } from "typeorm";
import JobPosting from "../entities/jobposting.entity";

class JobPostingRepository {
    constructor(private repository: Repository<JobPosting>) {}

    async create(job: JobPosting): Promise<JobPosting> {
        return this.repository.save(job);
    }

    async findMany(): Promise<JobPosting[]> {
        return this.repository.find({
            relations: {
                referrals: true,
            },
        });
    }

    async findOneById(id: number): Promise<JobPosting> {
        return this.repository.findOne({
            where: { id: id },
            relations: {
                referrals: true,
            },
        });
    }

    async findOneByTitle(title: string): Promise<JobPosting> {
        return this.repository.findOne({
            where: { title: title },
            relations: {
                referrals: true,
            },
        });
    }

    async update(id: number, job: JobPosting): Promise<void> {
        await this.repository.save({ id, ...job });
    }

    async delete(id: number): Promise<void> {
        await this.repository.softDelete({ id });
    }
}

export default JobPostingRepository;
