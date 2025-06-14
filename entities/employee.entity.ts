import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Person } from "./person.entity";
import AbstractEntity from "./abstract.entity";

@Entity()
class Employee extends AbstractEntity {
  @Column()
  joiningDate: Date;

  // Relations
  @OneToOne(() => Person, (user) => user.employee)
  @JoinColumn()
  user: Person;
}
export default Employee;
