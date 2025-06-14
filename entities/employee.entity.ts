import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Person } from "./person.entity";
import AbstractEntity from "./abstract.entity";

@Entity()
class Employee extends AbstractEntity {
  @Column()
  joiningDate: Date;
  @Column()
  password: string;
  // Relations
  @OneToOne(() => Person, (user) => user.employee)
  @JoinColumn()
  person: Person;
}
export default Employee;
