import Candidate from "../entities/candidate.entity";
import CandidateRepository from "../repositories/candidate.repository";
import PersonService, { personService } from "./person.service";
import { CreateCandidateDto } from "../dto/create-candidate-dto";
import HttpException from "../exception/httpException";
import { LoggerService } from "./logger.service";
import dataSource from "../db/data-source";
import { Person, UserRole } from "../entities/person.entity";

class CandidateService {
    private logger = LoggerService.getInstance(CandidateService.name);

    constructor(
        private candidateRepository: CandidateRepository,
        private personService: PersonService
    ) {}

    async createCandidate(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
        // Create the person first
        const newPerson = new Person();
        newPerson.name= createCandidateDto.person.name;
        newPerson.phone= createCandidateDto.person.phone;
        newPerson.email= createCandidateDto.person.email;     
        newPerson.role = UserRole.CANDIDATE 
        console.log(newPerson);
        const person = await this.personService.createPerson(newPerson);

        // Create the candidate and link to person
        const candidate = new Candidate();
        candidate.yearsOfExperience = createCandidateDto.yearsOfExperience;
        candidate.person = person;

        const savedCandidate = await this.candidateRepository.create(candidate);

        this.logger.info(
            `Created Candidate (Person: ${person.name}, CandidateId: ${savedCandidate.id})`
        );

        return savedCandidate;
    }

    async getAllCandidates(): Promise<Candidate[]> {
        const allCandidates = await this.candidateRepository.findMany();
        this.logger.info(`Fetched all candidates`);
        return allCandidates;
    }

    async getCandidateById(id: number): Promise<Candidate> {
        const candidate = await this.candidateRepository.findOneById(id);
        if (!candidate) {
            throw new HttpException(404, `Candidate with id ${id} not found`);
        }
        this.logger.info(`Fetched Candidate with id: ${id}`);
        return candidate;
    }

    async updateCandidate(id: number, updateCandidateDto: CreateCandidateDto): Promise<void> {
        const existingCandidate = await this.candidateRepository.findOneById(id);
        if (!existingCandidate) {
            throw new HttpException(404, `Candidate with id ${id} not found`);
        }

        // Update person details
        if (updateCandidateDto.person) {
            await this.personService.updatePerson(existingCandidate.person.id, updateCandidateDto.person);
        }

        // Update candidate details
        existingCandidate.yearsOfExperience = updateCandidateDto.yearsOfExperience;

        const updatedCandidate = await this.candidateRepository.update(id, existingCandidate);

        this.logger.info(`Updated Candidate with id: ${id}`);
       
    }


    async deleteCandidate(id: number): Promise<void> {
        const candidate = await this.candidateRepository.findOneById(id);
        if (!candidate) {
            throw new HttpException(404, `Candidate with id ${id} not found`);
        }
        await this.candidateRepository.delete(id);
        this.logger.info(`Deleted Candidate with id: ${id}`);
    }
}

export default CandidateService;

const candidateRepository = new CandidateRepository(dataSource.getRepository(Candidate));
export const candidateService = new CandidateService(candidateRepository,personService);