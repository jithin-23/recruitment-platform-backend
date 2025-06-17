import express from "express";
import dataSource from "../db/data-source";
import Bonus from "../entities/bonus.entity";
import BonusRepository from "../repositories/bonus.repository";
import BonusService from "../services/bonus.service";
import BonusController from "../controllers/bonus.controller";
import { referralService } from "../routes/referral.route";
const bonusRouter = express.Router();

const bonusRepository = new BonusRepository(dataSource.getRepository(Bonus));
const bonusService = new BonusService(bonusRepository, referralService);
const bonusController = new BonusController(bonusService, bonusRouter);

export default bonusRouter;
export { bonusService };
