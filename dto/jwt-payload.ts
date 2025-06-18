import { JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { UserRole } from "../entities/person.entity";

export interface CustomJwtPayload extends BaseJwtPayload {
    personId: number;
    personName: string;
    employeeId: number;
    email: string;
    role: UserRole;
}
