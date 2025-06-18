import { IsString, IsEnum, IsEmail } from "class-validator";


export class CreatePersonDto {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsString()
    @IsEmail()
    email: string;  
}