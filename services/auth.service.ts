import "dotenv/config";
import { CustomJwtPayload } from "../dto/jwt-payload";
import HttpException from "../exception/httpException";
import { LoggerService } from "./logger.service";
import jwt from "jsonwebtoken";
import PersonService from "./person.service";
import { UserRole } from "../entities/person.entity";
import EmployeeService from "./employee.service";

class AuthService {
    constructor(
        private personService: PersonService,
        private employeeService: EmployeeService
    ) {}
    private logger = LoggerService.getInstance(AuthService.name);

    async login(email: string, password: string) {
        this.logger.info(`Login service started`);
        const person = await this.personService.getPersonByEmail(email);
        if (
            !(
                person.role === UserRole.ADMIN ||
                person.role === UserRole.EMPLOYEE
            )
        ) {
            throw new HttpException(
                401,
                "User role does not have login privileges"
            );
        }

        const employee = await this.employeeService.getEmployeeByPerson(person);
        if (!(employee.password === password)) {
            throw new HttpException(401, "Incorrect password entry");
        }

        const payload: CustomJwtPayload = {
            personId: person.id,
            personName: person.name,
            employeeId: employee.id,
            email: person.email,
            role: person.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            // expiresIn: process.env.JWT_VALIDITY,
            expiresIn: "24h",
        });

        this.logger.info(
            `Login succesful for user:${person.email} with role:${person.role}`
        );

        return {
            tokenType: "Bearer",
            accessToken: token,
        };
    }
}

export default AuthService;
