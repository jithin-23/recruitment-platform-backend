import express from "express"
import ReferralRepository from "../repositories/referral.repository";
import dataSource from "../db/data-source";
import Referral from "../entities/referral.entity";
import ReferralService from "../services/referral.service";
import ReferralController from "../controllers/referral.controller";


const referralRouter = express.Router();

const referralRepository = new ReferralRepository(dataSource.getRepository(Referral));
const referralService = new ReferralService(referralRepository);
const referralController = new ReferralController(referralService, referralRouter);

export default referralRouter;
export {referralService};