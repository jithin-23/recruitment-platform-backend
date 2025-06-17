import { LoggerService } from "./logger.service";
import BonusRepository from "../repositories/bonus.repository";
import Bonus, { BonusStatus } from "../entities/bonus.entity";

import Referral from "../entities/referral.entity";
import ReferralService from "./referral.service";

class BonusService {
    private logger = LoggerService.getInstance(BonusService.name);

    constructor(
        private bonusRepository: BonusRepository,
        private referralService: ReferralService
    ) {}

    async getAllBonuses(): Promise<Bonus[]> {
        this.logger.info("Fetching all bonuses");
        return this.bonusRepository.findMany();
    }

    async getBonusesByEmployee(employeeId: number): Promise<Bonus[]> {
        this.logger.info(`Fetching bonuses for employee id: ${employeeId}`);
        const referrals: Referral[] =
            await this.referralService.getReferralsByReferrer(employeeId);

        const bonuses: Bonus[] = [];
        for (const referral of referrals) {
            if (referral.bonus) {
                bonuses.push(referral.bonus);
            }
        }
        return bonuses;
    }

    async updateBonusStatus(
        bonusId: number,
        newStatus: BonusStatus
    ): Promise<Bonus> {
        this.logger.info(
            `Updating bonus status for bonus id: ${bonusId} to ${newStatus}`
        );
        const bonus = await this.bonusRepository.findOneById(bonusId);

        if (!bonus) {
            throw new Error(`Bonus with id ${bonusId} not found`);
        }

        await this.bonusRepository.update(bonusId, { bonusStatus: newStatus });
        const updatedBonus = await this.bonusRepository.findOneById(bonusId);
        if (!updatedBonus) {
            throw new Error(`Bonus with id ${bonusId} not found after update`);
        }
        return updatedBonus;
    }
}

export default BonusService;
