import dataSource from "../db/data-source";
import { CreatePersonDto } from "../dto/create-person-dto";
import { Person } from "../entities/person.entity";
import HttpException from "../exception/httpException";
import PersonRepository from "../repositories/person.repository";
import { LoggerService } from "./logger.service";

class PersonService {
    private logger = LoggerService.getInstance(PersonService.name);

    constructor(private personRepository: PersonRepository) {}

    async createPerson(createPersonDto: CreatePersonDto): Promise<Person> {
        const newPerson = new Person();
        newPerson.name = createPersonDto.name;
        newPerson.phone = createPersonDto.phone;
        newPerson.email = createPersonDto.email;
        newPerson.role = createPersonDto.role;

        const savedPerson = await this.personRepository.create(newPerson);

        this.logger.info(`Created Person (${savedPerson.name}) with id: ${savedPerson.id}`);

        return savedPerson;
    }

    async getAllPersons(): Promise<Person[]> {
        const allPersons = await this.personRepository.findMany();
        this.logger.info(`All Persons Fetched`);
        return allPersons;
    }

    async getPersonById(id: number): Promise<Person> {
        const person = await this.personRepository.findOneById(id);
        if (!person) {
            throw new HttpException(404, `Person with id ${id} not found`);
        }
        this.logger.info(`Fetched Person with id: ${id}`);
        return person;
    }

    async getPersonByEmail(email: string): Promise<Person> {
        const person = await this.personRepository.findByEmail(email);
        if (!person) {
            throw new HttpException(404, `Person with email ${email} not found`);
        }
        this.logger.info(`Fetched Person with email: ${email}`);
        return person;
    }

   

    async deletePerson(id: number): Promise<void> {
        const existingPerson = await this.personRepository.findOneById(id);
        if (!existingPerson) {
            throw new HttpException(404, `Person with id ${id} not found`);
        }

        await this.personRepository.delete(id);

        this.logger.info(`Deleted Person (${existingPerson.name}) with id: ${existingPerson.id}`);
    }
}

const personRepository = new PersonRepository(dataSource.getRepository(Person));
const personService = new PersonService(personRepository);
export {personService};

export default PersonService;
