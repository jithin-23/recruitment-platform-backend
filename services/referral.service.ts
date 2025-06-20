import Referral, { ReferralStatus } from "../entities/referral.entity";
import ReferralRepository from "../repositories/referral.repository";
import { CreateReferralDto } from "../dto/create-referral-dto";
import HttpException from "../exception/httpException";
import { LoggerService } from "./logger.service";
import { personService } from "../routes/person.routes";
import { candidateService } from "./candidate.service";
import { jobPostingService } from "../routes/jobposting.routes";
import { ReferralResponseDto } from "../dto/referral-response.dto";
import ReferralStatusHistory from "../entities/referralstatushistory.entity";
import { resumeService } from "../routes/resume.routes";
import Resume from "../entities/resume.entity";
import { referralStatusHistoryService } from "./referralstatushistory.service";
import { notificationService } from "../routes/notification.routes";
import { Person, UserRole } from "../entities/person.entity";

class ReferralService {
	private logger = LoggerService.getInstance(ReferralService.name);

	constructor(private referralRepository: ReferralRepository) {}

	async createReferral(
		createReferralDto: CreateReferralDto
	): Promise<Referral> {
		// --- Fetch referrer, referred, and job posting (existing logic) ---
		const referrer = await personService.getPersonById(
			createReferralDto.referrerId
		);
		if (!referrer) {
			throw new HttpException(
				404,
				`Referrer with id ${createReferralDto.referrerId} not found`
			);
		}

		let referredPerson:Person = await personService
			.getPersonByEmail(createReferralDto.referred.person.email)
			.catch(() => null);

        if(referredPerson && referredPerson?.role !== UserRole.CANDIDATE) {
            throw new HttpException(
                400,
                `Referred person with email ${createReferralDto.referred.person.email} exists as an Employee.`
            );
        }

           if(referredPerson){
            referredPerson.name = createReferralDto.referred.person.name;
            referredPerson.phone = createReferralDto.referred.person.phone;
            // Update the person details if they already exist
            await personService.updatePerson(referredPerson.id, referredPerson);
            this.logger.info(
                `Updated existing referred person with id: ${referredPerson.id}`
            );
        }
        
		if (!referredPerson) {
			// Create candidate (which creates person)
			const candidate = await candidateService.createCandidate({
				person: createReferralDto.referred.person,
				yearsOfExperience: createReferralDto.referred.yearsOfExperience,
			});
			referredPerson = candidate.person;
		}

		const existingJobPosting = await jobPostingService.getJobPostingById(
			createReferralDto.jobPostingId
		);

		// --- Prevent duplicate referral within 6 months ---
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const recentReferral = await this.referralRepository.findRecentReferral(
			referredPerson.id,
			existingJobPosting.id,
			sixMonthsAgo
		);

		if (recentReferral) {
			throw new HttpException(
				409,
				"This candidate has already been referred for this role within the last 6 months."
			);
		}
		// --- End duplicate check ---

		let resumeToAssociate: Resume | undefined = undefined;

		if (createReferralDto.resumeId) {
			const resume = await resumeService.getResumeById(
				createReferralDto.resumeId
			);
			if (!resume) {
				throw new HttpException(
					404,
					`Resume with id ${createReferralDto.resumeId} not found. Please make sure the resume was uploaded successfully.`
				);
			}
			resumeToAssociate = resume;

			// Fire-and-forget: Call the background task without 'await'.
			resumeService.screenResumeInBackground(
				createReferralDto.resumeId,
				createReferralDto.jobPostingId
			);
			this.logger.info(
				`Dispatched background screening for resumeId: ${createReferralDto.resumeId}`
			);
		}

		const referral = new Referral();
		referral.jobPosting = existingJobPosting;
		referral.referrer = referrer;
		referral.referred = referredPerson;
		referral.resume = resumeToAssociate;

		const savedReferral = await this.referralRepository.createReferral(
			referral
		);
        
        const referralLog =
			await referralStatusHistoryService.createReferralLog(
				savedReferral
			);
		if (referralLog) {
			this.logger.info(
				`Created log for id: ${savedReferral.id} with updated status: ${referralLog.status}`
			);
		}

		this.logger.info(
			`Created Referral (id: ${savedReferral.id}) for job: ${savedReferral.jobPosting?.title}`
		);

		await notificationService.notifyAllAdmins(
			`New Referral Submitted for ${savedReferral.jobPosting.title}`,
			`A new referral has been submitted for the position "${savedReferral.jobPosting.title}" by ${savedReferral.referrer.name}. Candidate: ${savedReferral.referred.name}.`
		);

        await notificationService.notifyPerson(
            `New Referral Submitted`,
            `Referral submitted for "${savedReferral.jobPosting.title}" Candidate: ${savedReferral.referred.name}.`,
            savedReferral.referrer.id,
            savedReferral.id
        );
        await notificationService.notifyPerson(
            `New Referral Submitted`,
            `Referral submitted for "${savedReferral.jobPosting.title}" by ${savedReferral.referrer.name}.`,
            savedReferral.referred.id,
            savedReferral.id
        );
        this.logger.info(
            `Notification sent to referred person: ${savedReferral.referred.name} (id: ${savedReferral.referred.id})`
        );
        
		return savedReferral;
	}

	async getAllReferrals(): Promise<Referral[]> {
		const allReferrals = await this.referralRepository.findAll();
		this.logger.info(`Fetched all referrals`);
		return allReferrals;
	}

	async getReferralResponse(id: number): Promise<ReferralResponseDto> {
		const referral = await this.referralRepository.findById(id);
		if (!referral) {
			throw new HttpException(404, `Referral with id ${id} not found`);
		}
		const response = new ReferralResponseDto();
		const referralHistories =
			await this.referralRepository.findReferralHistory(id);

		let sortedHistories: ReferralStatusHistory[] = [];
		if (referralHistories && referralHistories.histories) {
			sortedHistories = referralHistories.histories.sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
			);
		}

		if (referral.status === "Rejected") {
			response.failedAt =
				sortedHistories[sortedHistories.length - 2].status;
		} else {
			response.failedAt = "";
		}
		
		(response.id = referral.id),
			(response.candidateName = referral.referred.name),
			(response.position = referral.jobPosting.title),
			(response.referredBy = referral.referrer.name),
			(response.submittedDate = referral.createdAt),
			(response.currentStatus = referral.status),
			(response.histories = sortedHistories),
			this.logger.info(`Fetched Referral with id: ${id}`);
	
		return response;
	}

	async getReferralById(id: number): Promise<Referral> {
		const referral = await this.referralRepository.findById(id);
		if (!referral) {
			throw new HttpException(404, `Referral with id ${id} not found`);
		}
		this.logger.info(`Fetched Referral with id: ${id}`);
		return referral;
	}

	async updateStatus(id: number, status: ReferralStatus): Promise<void> {
		const existingReferral = await this.referralRepository.findById(id);
		if (!existingReferral) {
			throw new HttpException(404, `Referral with id ${id} not found`);
		}
		existingReferral.status = status;
		const updatedReferral = await this.referralRepository.updateReferral(
			id,
			existingReferral
		);
		this.logger.info(`Updated Referral status to ${status} for id: ${id}`);

		const referralLog =
			await referralStatusHistoryService.createReferralLog(
				updatedReferral
			);
		if (referralLog) {
			this.logger.info(
				`Created log for id: ${id} with updated status: ${referralLog.status}`
			);
		}
        await notificationService.notifyReferralStatusChange(id);
        this.logger.info(
            `Notification sent for status change of referral id: ${id}`
        );
	}

	async rejectRefferalsByreferredId(referredId: number): Promise<void> {
		const existingReferrals = await this.referralRepository.findByreferred(
			referredId
		);
		if (!existingReferrals) {
			throw new HttpException(
				404,
				`Referrals for referred id ${referredId} not found`
			);
		}
		for (const referral of existingReferrals) {
            if(referral.status!== ReferralStatus.ACCEPTED) {
			referral.status = ReferralStatus.REJECTED;
			await this.updateStatus(referral.id, referral.status);
		}
    }
		this.logger.info(
			`Rejected all referrals for referred id: ${referredId}`
		);
	}

	async rejectRefferalsByJobPostingId(jobPostingId: number): Promise<void> {
		const existingReferrals =
			await this.referralRepository.findByJobPostingId(jobPostingId);
		if (!existingReferrals) {
			throw new HttpException(
				404,
				`Referrals for jobPosting id ${jobPostingId} not found`
			);
		}
		for (const referral of existingReferrals) {
            if(referral.status !== ReferralStatus.ACCEPTED) {
			referral.status = ReferralStatus.REJECTED;
			await this.updateStatus(referral.id, referral.status);
		}
     }
		this.logger.info(
			`Rejected all referrals for jobPosting id: ${jobPostingId}`
		);
	}

	async getReferralHistory(id: number): Promise<Referral> {
		const referral = await this.referralRepository.findReferralHistory(id);
		if (!referral) {
			throw new HttpException(
				404,
				`Referral history for id ${id} not found`
			);
		}
		this.logger.info(`Fetched Referral history for id: ${id}`);
		return referral;
	}

	async getReferralsByReferrer(referrerId: number): Promise<Referral[]> {
		const referrals = await this.referralRepository.findByReferrer(
			referrerId
		);
		this.logger.info(`Fetched referrals for referrer id: ${referrerId}`);
		return referrals;
	}
}

export default ReferralService;
