import express from "express";
import dataSource from "../db/data-source";
import Resume from "../entities/resume.entity";
import ResumeRepository from "../repositories/resume.repository";
import ResumeService from "../services/resume.service";
import ResumeController from "../controllers/resume.controller";

const resumeRouter = express.Router();

const resumeRepository = new ResumeRepository(dataSource.getRepository(Resume));
const resumeService = new ResumeService(resumeRepository);
const resumeController = new ResumeController(resumeService, resumeRouter);

export default resumeRouter;
export { resumeService };
