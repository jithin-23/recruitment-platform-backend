import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Person } from "./person.entity";
import AbstractEntity from "./abstract.entity";

@Entity()
class Candidate extends AbstractEntity {
  @Column()
  yearsOfExperience: number;

  // Relations
  @OneToOne(() => Person, (user) => user.candidate)
  @JoinColumn()
  person: Person;
}
export default Candidate;
