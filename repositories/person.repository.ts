import { Repository } from "typeorm";
import { Person } from "../entities/person.entity";

class PersonRepository {
  constructor(private repository: Repository<Person>) {}

  async create(person: Person): Promise<Person> {
    return this.repository.save(person);
  }

  async findMany(): Promise<Person[]> {
    return this.repository.find({
      relations: {
        employee: true,
        candidate: true,
      },
    });
  }

  async findOneById(id: number): Promise<Person | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        employee: true,
        candidate: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Person | null> {
    return this.repository.findOneBy({ email });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  async remove(person: Person): Promise<void> {
    await this.repository.remove(person);
  }

  async update(id: number, person: Person): Promise<void> {
    const existing = await this.findOneById(id);
    if (!existing) return;

    const { employee, candidate, ...personFields } = person;
    Object.assign(existing, personFields);

    if (employee) {
      existing.employee = employee;
    }else if (candidate) {
      existing.candidate = candidate;
    }

    await this.repository.save(existing);
  }
}

export default PersonRepository;
