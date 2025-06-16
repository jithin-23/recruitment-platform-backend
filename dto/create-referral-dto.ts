import { IsNumber, IsOptional, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { CreateCandidateDto } from "./create-candidate-dto";
import { ReferralStatus } from "../entities/referral.entity";

export class CreateReferralDto {
    @IsNumber()
    referrerId: number;

    @ValidateNested()
    @Type(() => CreateCandidateDto)
    referred: CreateCandidateDto; 

    @IsNumber()
    jobPostingId: number;

  
    @IsOptional()
    resume?: any; // Adjust as needed
}