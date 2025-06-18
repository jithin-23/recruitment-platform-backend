import { CreateJobPostingDto } from "../dto/create-jobposting.dto";
import { UpdateJobPostingDto } from "../dto/update-jobposting.dto";
import JobPosting from "../entities/jobposting.entity";
import HttpException from "../exception/httpException";
import JobPostingRepository from "../repositories/jobposting.repository";
import { referralService } from "../routes/referral.route";
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
        newJobPosting.remainingPositions = createJobPostingDto.numOfPositions;

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

        if (updateJobPostingDto.numOfPositions !== undefined) {
            if (
                updateJobPostingDto.numOfPositions <
                existingJobPosting.remainingPositions
            ) {
                existingJobPosting.remainingPositions =
                    updateJobPostingDto.numOfPositions;
            }
            existingJobPosting.numOfPositions =
                updateJobPostingDto.numOfPositions;
        }

        if (updateJobPostingDto.remainingPositions !== undefined) {
            if (
                updateJobPostingDto.remainingPositions >
                existingJobPosting.numOfPositions
            )
                throw new HttpException(
                    400,
                    "Remaining position cannot be greater than total number of positions"
                );
            existingJobPosting.remainingPositions =
                updateJobPostingDto.remainingPositions;
        }

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

    async decrementRemainingPositions(id: number): Promise<void> {
        const jobPosting = await this.jobPostingRepository.findOneById(id);
        if (!jobPosting) {
            throw new HttpException(404, `Job posting with id ${id} not found`);
        }

        if (jobPosting.remainingPositions <= 0) {
            throw new HttpException(
                400,
                `No remaining positions available for job posting with id ${id}`
            );
        }
        jobPosting.remainingPositions -= 1;
        if(jobPosting.remainingPositions===0){
           await referralService.rejectRefferalsByJobPostingId(jobPosting.id);
           this.logger.info(`All referrals for job posting with id ${id} have been rejected`)
        }
        await this.jobPostingRepository.update(id, jobPosting);

        this.logger.info(
            `JobPosting ${id} remainingPositions decremented to ${jobPosting.remainingPositions}`
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
