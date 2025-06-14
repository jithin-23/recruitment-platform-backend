import { CreateJobPostingDto } from "../dto/create-jobposting.dto";
import { UpdateJobPostingDto } from "../dto/update-jobposting.dto";
import JobPosting from "../entities/jobposting.entity";
import HttpException from "../exception/httpException";
import JobPostingRepository from "../repositories/jobposting.repository";
import { LoggerService } from "./logger.service";

class JobPostingService {
    private logger = LoggerService.getInstance(JobPostingService.name);
    constructor(private jobPostingRepository: JobPostingRepository) {}

    async createJobPosting(
        createJobPostingDto: CreateJobPostingDto
    ): Promise<JobPosting> {
        const newJobPosting = new JobPosting();
        newJobPosting.title = createJobPostingDto.title;
        newJobPosting.description = createJobPostingDto.description;
        newJobPosting.skills = createJobPostingDto.skills;
        newJobPosting.location = createJobPostingDto.location;
        newJobPosting.numOfPositions = createJobPostingDto.numOfPositions;
        newJobPosting.experience = createJobPostingDto.experience;
        newJobPosting.salary = createJobPostingDto.salary;
        newJobPosting.bonusForReferral = createJobPostingDto.bonusForReferral;

        const savedJob = await this.jobPostingRepository.create(newJobPosting);

        this.logger.info(
            `Created Job Posting (${savedJob.title}) with id: ${savedJob.id}`
        );

        return savedJob;
    }

    async getAllJobPostings(): Promise<JobPosting[]> {
        const allJobPosting = await this.jobPostingRepository.findMany();
        this.logger.info(`All Job Postings Fetched`);
        return allJobPosting;
    }

    async getJobPostingById(id: number): Promise<JobPosting> {
        const jobPosting = await this.jobPostingRepository.findOneById(id);
        if (!jobPosting) {
            throw new HttpException(404, `Job posting with id ${id} not found`);
        }
        this.logger.info(`Fetched Job posting with id: ${id}`);
        return jobPosting;
    }

    async getJobPostingByTitle(title: string): Promise<JobPosting> {
        const jobPosting = await this.jobPostingRepository.findOneByTitle(
            title
        );
        if (!jobPosting) {
            throw new HttpException(
                404,
                `Job posting with title "${title}" not found`
            );
        }
        this.logger.info(`Fetched Job posting with title: ${title}`);
        return jobPosting;
    }

    async updateJobPosting(
        id: number,
        updateJobPostingDto: UpdateJobPostingDto
    ): Promise<void> {
        const existingJobPosting = await this.jobPostingRepository.findOneById(
            id
        );
        if (!existingJobPosting) {
            throw new HttpException(404, "Job Posting not found");
        }

        if (updateJobPostingDto.title !== undefined)
            existingJobPosting.title = updateJobPostingDto.title;

        if (updateJobPostingDto.description !== undefined)
            existingJobPosting.description = updateJobPostingDto.description;

        if (updateJobPostingDto.skills !== undefined)
            existingJobPosting.skills = updateJobPostingDto.skills;

        if (updateJobPostingDto.location !== undefined)
            existingJobPosting.location = updateJobPostingDto.location;

        if (updateJobPostingDto.numOfPositions !== undefined)
            existingJobPosting.numOfPositions =
                updateJobPostingDto.numOfPositions;

        if (updateJobPostingDto.experience !== undefined)
            existingJobPosting.experience = updateJobPostingDto.experience;

        if (updateJobPostingDto.salary !== undefined)
            existingJobPosting.salary = updateJobPostingDto.salary;

        if (updateJobPostingDto.bonusForReferral !== undefined)
            existingJobPosting.bonusForReferral =
                updateJobPostingDto.bonusForReferral;

        await this.jobPostingRepository.update(id, existingJobPosting);

        this.logger.info(
            `Updated Job Posting (${existingJobPosting.title}) with id: ${existingJobPosting.id}`
        );
    }

    async deleteJobPosting(id: number): Promise<void> {
        const existingJobPosting = await this.jobPostingRepository.findOneById(
            id
        );
        if (!existingJobPosting) {
            throw new HttpException(404, `Job posting with id ${id} not found`);
        }

        await this.jobPostingRepository.delete(id);
        this.logger.info(
            `Deleted Job Posting (${existingJobPosting.title}) with id: ${existingJobPosting.id}`
        );
    }
}

export default JobPostingService;
