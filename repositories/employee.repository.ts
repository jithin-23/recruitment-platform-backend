import { Repository } from "typeorm";
import Employee from "../entities/employee.entity";
import { Person } from "../entities/person.entity";

class EmployeeRepository {
  constructor(private repository: Repository<Employee>) {}

  async create(employee: Employee): Promise<Employee> {
    return this.repository.save(employee);
  }

  async findMany(): Promise<Employee[]> {
    return this.repository.find({
      relations: {
        person: true,
      },
    });
  }

  async findOneById(id: number): Promise<Employee | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        person: true,
      },
    });
  }

  async findOneByPerson(person: Person): Promise<Employee | null> {
    return this.repository.findOne({
      where: { person:{ id: person.id }},
      relations: {
        person: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  async remove(employee: Employee): Promise<void> {
    await this.repository.remove(employee);
  }

  async update(id: number, employee: Employee): Promise<void> {
    const existing = await this.findOneById(id);
    if (!existing) return;

    const { person, ...employeeFields } = employee;
    Object.assign(existing, employeeFields);

    if (person) {
      
        existing.person = person;
    }

    await this.repository.save(existing);
  }
}

export default EmployeeRepository;
