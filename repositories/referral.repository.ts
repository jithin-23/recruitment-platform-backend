import { MoreThanOrEqual, Repository } from "typeorm";
import Referral from "../entities/referral.entity";

class ReferralRepository {
	constructor(private repository: Repository<Referral>) {}

	async createReferral(referral: Referral): Promise<Referral> {
		return this.repository.save(referral);
	}

	async findAll(): Promise<Referral[]> {
		return this.repository.find({
			where: { deletedAt: null },
			relations: {
				jobPosting: true,
				referrer: { employee: true },
				referred: { candidate: true },
				resume: true,
			},
		});
	}

	async findById(id: number): Promise<Referral | null> {
		return this.repository.findOne({
			where: { id, deletedAt: null },
			relations: {
				jobPosting: true,
				referrer: { employee: true },
				referred: { candidate: true },
				resume: true,
			},
		});
	}

	async findReferralHistory(id: number): Promise<Referral> {
		return this.repository.findOne({
			where: { id },
			relations: {
				histories: true,
			},
		});
	}

	async findRecentReferral(
		referredPersonid,
		existingJobPostingid,
		sixMonthsAgo
	): Promise<Referral> {
		return this.repository.findOne({
			where: {
				referred: { id: referredPersonid },
				jobPosting: { id: existingJobPostingid },
				createdAt: MoreThanOrEqual(sixMonthsAgo),
			},
		});
	}

	async findByReferrer(referrerId: number): Promise<Referral[]> {
		return this.repository.find({
			where: {
				referrer: { id: referrerId },
				deletedAt: null,
			},
			relations: {
				jobPosting: true,
				referred: true,
				resume: true,
				bonus: true,
			},
		});
	}

	async updateReferral(id: number, referral: Referral): Promise<Referral> {
		return this.repository.save({ id, ...referral });
	}

	async softDeleteReferral(id: number): Promise<void> {
		await this.repository.softDelete(id);
	}
}

export default ReferralRepository;
