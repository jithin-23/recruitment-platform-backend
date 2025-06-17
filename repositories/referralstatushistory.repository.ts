import { Repository } from "typeorm";
import ReferralStatusHistory from "../entities/referralstatushistory.entity";

class ReferralStatusHistoryRepository{
    constructor(private repository:Repository<ReferralStatusHistory>){}


    async createReferralLog(referralLog: ReferralStatusHistory): Promise<ReferralStatusHistory> {
		return this.repository.save(referralLog);
	}
}
export default ReferralStatusHistoryRepository;