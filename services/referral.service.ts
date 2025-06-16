import Referral, { ReferralStatus } from "../entities/referral.entity";
import ReferralRepository from "../repositories/referral.repository";
import { CreateReferralDto } from "../dto/create-referral-dto";
import HttpException from "../exception/httpException";
import { LoggerService } from "./logger.service";
import {personService} from "./person.service";
import {candidateService} from "./candidate.service";
import {jobPostingService} from "../routes/jobposting.routes";


class ReferralService {
    private logger = LoggerService.getInstance(ReferralService.name);

    constructor(
        private referralRepository: ReferralRepository,
       
    ) {}

    async createReferral(createReferralDto: CreateReferralDto): Promise<Referral> {
        // Fetch referrer by ID
        const referrer = await personService.getPersonById(createReferralDto.referrerId);
        if (!referrer) {
            throw new HttpException(404, `Referrer with id ${createReferralDto.referrerId} not found`);
        }

        let referredPerson = await personService.getPersonByEmail(createReferralDto.referred.person.email)
            .catch(() => null);

        if (!referredPerson) {
            // Create candidate (which creates person)
            const candidate = await candidateService.createCandidate({
                person: createReferralDto.referred.person,
                yearsOfExperience: createReferralDto.referred.yearsOfExperience
            });
            referredPerson = candidate.person;
        }

        const existingJobPosting = await jobPostingService.getJobPostingById(createReferralDto.jobPostingId);

        // --- Prevent duplicate referral within 6 months ---
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentReferral = await this.referralRepository.findRecentReferral(referredPerson.id,existingJobPosting.id,sixMonthsAgo)

        if (recentReferral) {
            throw new HttpException(
                409,
                "This candidate has already been referred for this role within the last 6 months."
            );
        }
        // --- End duplicate check ---

        const referral = new Referral();
        referral.jobPosting = existingJobPosting;
        referral.referrer = referrer;
        referral.referred = referredPerson;
        referral.resume = createReferralDto.resume;

        const savedReferral = await this.referralRepository.createReferral(referral);

        this.logger.info(
            `Created Referral (id: ${savedReferral.id}) for job: ${savedReferral.jobPosting?.title}`
        );

        return savedReferral;
    }


    async getAllReferrals(): Promise<Referral[]> {
        const allReferrals = await this.referralRepository.findAll();
        this.logger.info(`Fetched all referrals`);
        return allReferrals;
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
        const updatedReferral = await this.referralRepository.updateReferral(id, existingReferral);
        this.logger.info(`Updated Referral status to ${status} for id: ${id}`);   
        }

    async getReferralsByReferrer(referrerId: number): Promise<Referral[]> {
        const referrals = await this.referralRepository.findByReferrer(referrerId);
        this.logger.info(`Fetched referrals for referrer id: ${referrerId}`);
        return referrals;
    }

   
}

export default ReferralService;