import { Entity, Column, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity"
import  Employee  from "./employee.entity";
import Candidate  from "./candidate.entity";

export enum UserRole {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE',
    CANDIDATE = 'CANDIDATE'
}

@Entity()
export class Person extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    phone: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        nullable: false
    })
    role: UserRole;

    // Relations
    @OneToOne(() => Employee, employee => employee.person)
    employee?: Employee;

    @OneToOne(() => Candidate, candidate => candidate.person)
    candidate?: Candidate;
}
