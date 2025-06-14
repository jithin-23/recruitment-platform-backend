import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateJobPostingDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    skills?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsNumber()
    numOfPositions?: number;

    @IsOptional()
    @IsNumber()
    experience?: number;

    @IsOptional()
    @IsNumber()
    salary?: number;
}
