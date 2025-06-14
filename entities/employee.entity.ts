import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Person } from "./person.entity";

@Entity()
class Employee {
    @PrimaryColumn()
    empId: number;

    @Column()
    joining_date: Date;

    // Relations
    @OneToOne(() => Person, user => user.employee)
    @JoinColumn()
    user: Person;
}
export default Employee;