import express from "express"
import JobPostingRepository from "../repositories/jobposting.repository";
import dataSource from "../db/data-source";
import JobPosting from "../entities/jobposting.entity";
import JobPostingService from "../services/jobposting.service";
import JobPostingController from "../controllers/employee.controller";

const jobPostingRouter = express.Router();

const jobPostingRepository = new JobPostingRepository(dataSource.getRepository(JobPosting));
const jobPostingService = new JobPostingService(jobPostingRepository);
const jobPostingController = new JobPostingController(jobPostingService, jobPostingRouter);

export default jobPostingRouter;
export {jobPostingService};