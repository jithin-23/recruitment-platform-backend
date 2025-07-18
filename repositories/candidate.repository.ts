import { Repository, EntityManager } from "typeorm";
import Candidate from "../entities/candidate.entity";
import { Person } from "../entities/person.entity";

class CandidateRepository {
  constructor(private repository: Repository<Candidate>) {}

  async create(candidate: Candidate): Promise<Candidate> {
    return this.repository.save(candidate);
  }

  async findMany(): Promise<Candidate[]> {
    return this.repository.find({
      where: { deletedAt: null },
      relations: {
        person: true,
      },
    });
  }

  async findOneById(id: number): Promise<Candidate | null> {
    return this.repository.findOne({
      where: { id, deletedAt: null },
      relations: {
        person: true,
      },
    });
  }

  async findOneByPersonId(personId: number): Promise<Candidate | null> {
    return this.repository.findOne({
      where: { person: { id: personId }, deletedAt: null },
    });
  }

  async softRemove(candidate: Candidate, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(Candidate) : this.repository;
    await repo.softRemove(candidate);
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async remove(candidate: Candidate): Promise<void> {
    await this.repository.remove(candidate);
  }

  async update(id: number, candidate: Candidate): Promise<void> {
    const existing = await this.findOneById(id);
    if (!existing) return;

    const { person, ...candidateFields } = candidate;
    Object.assign(existing, candidateFields);

    if (person) {
        existing.person = person;
    }

    await this.repository.save(existing);
  }
}

export default CandidateRepository;
