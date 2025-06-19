// services/conversion.service.ts

import dataSource from "../db/data-source";
import HttpException from "../exception/httpException";
import { LoggerService } from "./logger.service";
import Referral, { ReferralStatus } from "../entities/referral.entity";
import { Person, UserRole } from "../entities/person.entity";
import Candidate from "../entities/candidate.entity";
import Employee from "../entities/employee.entity";
import JobPosting from "../entities/jobposting.entity";
import Bonus, { BonusStatus } from "../entities/bonus.entity";
import { notificationService } from "../routes/notification.routes";
import CandidateRepository from "../repositories/candidate.repository";
import { jobPostingService } from "../routes/jobposting.routes";

class ConversionService {
    private logger = LoggerService.getInstance(ConversionService.name);

    async convertReferralToEmployee(
        referralId: number,
        joiningDate: Date
    ): Promise<Employee> {
        this.logger.info(
            `Starting conversion process for referral ID: ${referralId}`
        );

        return dataSource.transaction(async (transactionalEntityManager) => {
            const referral = await transactionalEntityManager.findOne(
                Referral,
                {
                    where: { id: referralId },
                    relations: ["referred", "referrer", "jobPosting"],
                }
            );

            if (!referral)
                throw new HttpException(
                    404,
                    `Referral with ID ${referralId} not found.`
                );
            if (referral.status !== ReferralStatus.ACCEPTED)
                throw new HttpException(
                    400,
                    "Cannot convert. Referral status must be 'Accepted'."
                );
            if (!referral.jobPosting)
                throw new HttpException(
                    400,
                    "Referral must be associated with a existing job posting."
                );
            if (referral.jobPosting.filledPositions >= referral.jobPosting.numOfPositions)
                throw new HttpException(
                    400,
                    `No remaining positions for job: ${referral.jobPosting.title}`
                );

            const personToHire = referral.referred;

            // 1. Update Person Role
            personToHire.role = UserRole.EMPLOYEE;
            await transactionalEntityManager.save(Person, personToHire);

            // 2. Create new Employee record
            const newEmployee = new Employee();
            newEmployee.person = personToHire;
            newEmployee.joiningDate = joiningDate;
            newEmployee.password = `password`; // Set temporary password
            const savedEmployee = await transactionalEntityManager.save(
                Employee,
                newEmployee
            );

            // 3. Soft-Delete Candidate Record
            const candidateRepo = new CandidateRepository(
                transactionalEntityManager.getRepository(Candidate)
            );
            const candidateToDelete = await candidateRepo.findOneByPersonId(
                personToHire.id
            );
            if (candidateToDelete) {
                await candidateRepo.softRemove(
                    candidateToDelete,
                    transactionalEntityManager
                );
                this.logger.info(
                    `Soft-deleted Candidate record for person ID: ${personToHire.id}`
                );
            }

            // 4. Increment Job Posting Positions
            await jobPostingService.incrementFilledPosition(
                referral.jobPosting.id
            );

            // 5. Create Bonus Record
            const bonus = new Bonus();
            bonus.referral = referral;
            bonus.bonusAmount = referral.jobPosting.bonusForReferral;
            bonus.bonusStatus = BonusStatus.NOT_DUE;
            const triggerDate = new Date(joiningDate);
            triggerDate.setMonth(triggerDate.getMonth() + 6);
            bonus.triggerDate = triggerDate;
            await transactionalEntityManager.save(Bonus, bonus);

            // 6. Send Notifications
            await notificationService.notifyPerson(
                "Welcome to the Team!",
                `Congratulations! You have been hired for the role of ${
                    referral.jobPosting.title
                }. Your joining date is ${joiningDate.toDateString()}.`,
                personToHire.id,
                referral.id
            );

            await notificationService.notifyPerson(
                "Referral Success!",
                `Your referral, ${
                    personToHire.name
                }, has accepted the offer. Your bonus of ${
                    bonus.bonusAmount
                } will be due.`,
                referral.referrer.id,
                referral.id
            );

            await notificationService.notifyAllAdmins(
                "New Employee Hired!",
                `${personToHire.name} has been hired for the role of ${referral.jobPosting.title}.`
            );

            return savedEmployee;
        });
    }
}

export const conversionService = new ConversionService();
