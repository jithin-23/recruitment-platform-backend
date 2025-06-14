import { IsNumber, IsString } from "class-validator";

export class CreateJobpostingDto {
    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsString()
    skills: string;

    @IsString()
    location:string;

    @IsNumber()
    numOfPositions: number;

    @IsNumber()
    experience: number;

    @IsNumber()
    salary: number;
}