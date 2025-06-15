import dataSource from "../db/data-source";
import Employee from "../entities/employee.entity";
import { Person } from "../entities/person.entity";
import HttpException from "../exception/httpException";
import EmployeeRepository from "../repositories/employee.repository";
import { LoggerService } from "./logger.service";
import PersonService, { personService } from "./person.service";

class EmployeeService {
    private logger = LoggerService.getInstance(EmployeeService.name);
    constructor(
        private employeeRepository: EmployeeRepository,
        private personService: PersonService
    ) {}

    async getEmployeeByPerson(person: Person): Promise<Employee> {
        const employee = await this.employeeRepository.findOneByPerson(person);
        if (!employee) {
            throw new HttpException(
                404,
                `Employee with person_id ${person.id} not found.`
            );
        }
        this.logger.info(
            `Fetched Employee with person_id: ${employee.person.id}}`
        );
        return employee;
    }
}

const employeeRepository = new EmployeeRepository(
    dataSource.getRepository(Employee)
);
const employeeService = new EmployeeService(employeeRepository, personService);

export { employeeService };
export default EmployeeService;
