import { NextFunction, Request, Response, Router } from "express";
import JobPostingService from "../services/jobposting.service";
import { plainToInstance } from "class-transformer";
import { CreateJobPostingDto } from "../dto/create-jobposting.dto";
import { validate } from "class-validator";
import HttpException from "../exception/httpException";
import { UpdateJobPostingDto } from "../dto/update-jobposting.dto";
import { createAuthorizationMiddleware } from "../middlewares/authorizationMiddleware";
import { UserRole } from "../entities/person.entity";
import { authMiddleware } from "../middlewares/authMiddleware";

class JobPostingController {
    constructor(
        private jobPostingService: JobPostingService,
        private router: Router
    ) {
        router.post("/",authMiddleware,createAuthorizationMiddleware(UserRole.ADMIN), this.createJobPosting.bind(this));
        router.get("/", this.getAllJobPostings.bind(this));
        router.get("/:id", this.getJobPostingById.bind(this));
        router.put("/:id", authMiddleware,createAuthorizationMiddleware(UserRole.ADMIN), this.updateJobPosting.bind(this));
        router.patch("/:id", authMiddleware,createAuthorizationMiddleware(UserRole.ADMIN), this.updateJobPosting.bind(this));
        router.delete("/:id", authMiddleware,createAuthorizationMiddleware(UserRole.ADMIN), this.deleteJobPosting.bind(this));
    }

    async createJobPosting(req: Request, res: Response, next: NextFunction) {
        try {
            const createJobPostingDto = plainToInstance(
                CreateJobPostingDto,
                req.body
            );
            const errors = await validate(createJobPostingDto);
            if (errors.length > 0) {
                throw new HttpException(400, JSON.stringify(errors));
            }

            const savedEmployee = await this.jobPostingService.createJobPosting(
                createJobPostingDto
            );
            res.status(201).send(savedEmployee);
        } catch (error) {
            next(error);
        }
    }

    async getAllJobPostings(req: Request, res: Response) {
        const jobPostings = await this.jobPostingService.getAllJobPostings();
        res.status(200).send(jobPostings);
    }

    async getJobPostingById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const jobPosting = await this.jobPostingService.getJobPostingById(
                id
            );
            res.status(200).json(jobPosting);
        } catch (err) {
            next(err);
        }
    }

    async updateJobPosting(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const updateJobPostingDto = plainToInstance(
                UpdateJobPostingDto,
                req.body
            );

            const errors = await validate(updateJobPostingDto);
            if (errors.length > 0) {
                throw new HttpException(400, JSON.stringify(errors));
            }

            await this.jobPostingService.updateJobPosting(
                id,
                updateJobPostingDto
            );
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async deleteJobPosting(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await this.jobPostingService.deleteJobPosting(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default JobPostingController;
