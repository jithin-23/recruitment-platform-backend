import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Person } from "./person.entity";


@Entity()
class Candidate {
    @PrimaryColumn()
    candidateId: number;

    @Column()
    yearsOfExperience:number;

    // Relations
    @OneToOne(() => Person, user => user.candidate)
    @JoinColumn()
    user: Person;
}
export default Candidate;