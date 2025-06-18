import { LoggerService } from "./logger.service";
import { LessThan } from "typeorm";
import BonusRepository from "../repositories/bonus.repository";
import Bonus, { BonusStatus } from "../entities/bonus.entity";

import Referral from "../entities/referral.entity";
import ReferralService from "./referral.service";
import { notificationService } from "../routes/notification.routes";

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

    async updateOverdueBonuses(): Promise<number> {
        this.logger.info("Checking for overdue bonuses to update...");
        const now = new Date();
        
        // Find bonuses that are not due but whose trigger date has passed
        const overdueBonuses = await this.bonusRepository.find({
            where: {
                bonusStatus: BonusStatus.NOT_DUE,
                triggerDate: LessThan(now)
            },
            relations: ["referral", "referral.referred"] // Load referral and referred person
        });

        if (overdueBonuses.length === 0) {
            this.logger.info("No overdue bonuses found.");
            return 0;
        }

        this.logger.info(`Found ${overdueBonuses.length} bonuses to update.`);
        for (const bonus of overdueBonuses) {
            await this.bonusRepository.update(bonus.id, { bonusStatus: BonusStatus.DUE });
            this.logger.info(`Updated bonus ID ${bonus.id} to DUE.`);
            await notificationService.notifyAllAdmins(
                "Bonus Due!",
                `A bonus of ${bonus.bonusAmount} for ${bonus.referral.referred.name} is now due.`
            );
        }

        return overdueBonuses.length;
    }
}

export default BonusService;
