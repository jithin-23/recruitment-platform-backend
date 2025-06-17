import { IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreatePersonDto } from "./create-person-dto";

export class CreateCandidateDto {
    @ValidateNested()
    @Type(() => CreatePersonDto)
    person: CreatePersonDto;

    @IsNumber()
    yearsOfExperience: number;
}