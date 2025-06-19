import { CreateJobPostingDto } from "../dto/create-jobposting.dto";
import { UpdateJobPostingDto } from "../dto/update-jobposting.dto";
import JobPosting from "../entities/jobposting.entity";
import HttpException from "../exception/httpException";
import JobPostingRepository from "../repositories/jobposting.repository";
import { notificationService } from "../routes/notification.routes";
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

        if (updateJobPostingDto.experience !== undefined)
            existingJobPosting.experience = updateJobPostingDto.experience;

        if (updateJobPostingDto.salary !== undefined)
            existingJobPosting.salary = updateJobPostingDto.salary;

        if (updateJobPostingDto.bonusForReferral !== undefined)
            existingJobPosting.bonusForReferral =
                updateJobPostingDto.bonusForReferral;

        // Update numOfPositions
        if (updateJobPostingDto.numOfPositions !== undefined) {
            if (
                existingJobPosting.filledPositions >
                updateJobPostingDto.numOfPositions
            ) {
                throw new HttpException(
                    400,
                    "Number of positions cannot be less than the number of already filled positions"
                );
            }
            existingJobPosting.numOfPositions =
                updateJobPostingDto.numOfPositions;
        }

        // Update filledPositions
        if (updateJobPostingDto.filledPositions !== undefined) {
            if (
                updateJobPostingDto.filledPositions >
                existingJobPosting.numOfPositions
            ) {
                throw new HttpException(
                    400,
                    "Filled positions cannot exceed total number of positions"
                );
            }
            existingJobPosting.filledPositions =
                updateJobPostingDto.filledPositions;
        }

        await this.jobPostingRepository.update(id, existingJobPosting);

        this.logger.info(
            `Updated Job Posting (${existingJobPosting.title}) with id: ${existingJobPosting.id}`
        );
    }

    async incrementFilledPosition(id: number): Promise<void> {
        const jobPosting = await this.jobPostingRepository.findOneById(id);
        if (!jobPosting) {
            throw new HttpException(404, `Job posting with id ${id} not found`);
        }

        if (jobPosting.filledPositions >= jobPosting.numOfPositions) {
            throw new HttpException(
                400,
                `No remaining positions available for job posting with id ${id}`
            );
        }

        jobPosting.filledPositions += 1;
        await this.jobPostingRepository.update(id, jobPosting);

        this.logger.info(
            `JobPosting with id: ${id} filledPositions incremented to ${jobPosting.filledPositions}`
        );

        if (jobPosting.filledPositions === jobPosting.numOfPositions) {
            await referralService.rejectRefferalsByJobPostingId(jobPosting.id);

            this.logger.info(
                `All referrals for job posting with id ${id} have been rejected since all positions are filled`
            );

            await notificationService.notifyAllAdmins(
                `"${jobPosting.title}" is now closed.`,
                `All positions are filled.`
            );

            this.logger.info(
                `Deleting JobPosting with id: ${id} since all positions have been filled`
            );

            await this.jobPostingRepository.softDelete(id);

            await notificationService.notifyAllAdmins(
                `"${jobPosting.title}" deleted.`,
                `Job posting closed.`
            );
        }
    }

    async deleteJobPosting(id: number): Promise<void> {
        const existingJobPosting = await this.jobPostingRepository.findOneById(
            id
        );
        if (!existingJobPosting) {
            throw new HttpException(404, `Job posting with id ${id} not found`);
        }

        await this.jobPostingRepository.softDelete(id);
        this.logger.info(
            `Deleted Job Posting (${existingJobPosting.title}) with id: ${existingJobPosting.id}`
        );
    }
}

export default JobPostingService;
