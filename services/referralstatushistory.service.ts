import dataSource from "../db/data-source";
import Referral, { ReferralStatus } from "../entities/referral.entity";
import ReferralStatusHistory from "../entities/referralstatushistory.entity";
import ReferralStatusHistoryRepository from "../repositories/referralstatushistory.repository";
import { LoggerService } from "./logger.service";

class ReferralStatusHistoryService{
    private logger = LoggerService.getInstance(ReferralStatusHistoryService.name);
    constructor(private referralStatusHistoryRepository:ReferralStatusHistoryRepository){}

    async createReferralLog(referral:Referral): Promise<ReferralStatusHistory> {
        const newReferralLog = new ReferralStatusHistory();
        newReferralLog.status = referral.status;
        newReferralLog.referral = referral;
        const savedReferralLog= await this.referralStatusHistoryRepository.createReferralLog(newReferralLog);
        return savedReferralLog;
}
}
export default ReferralStatusHistoryService;

const referralStatusHistoryRepository = new ReferralStatusHistoryRepository(dataSource.getRepository(ReferralStatusHistory));
export const referralStatusHistoryService = new ReferralStatusHistoryService(referralStatusHistoryRepository);