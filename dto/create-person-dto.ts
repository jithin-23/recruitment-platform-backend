import { IsString, IsEnum } from "class-validator";
import { UserRole } from "../entities/person.entity";

export class CreatePersonDto {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsString()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;
}