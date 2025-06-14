import { Entity, Column, OneToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Employee from "./employee.entity";
import Candidate from "./candidate.entity";
import Notification from "./notification.entity";
import Referral from "./referral.entity";

export enum UserRole {
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE",
    CANDIDATE = "CANDIDATE",
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
        type: "enum",
        enum: UserRole,
        nullable: false,
    })
    role: UserRole;

    // Relations
    @OneToOne(() => Employee, (employee) => employee.user)
    employee?: Employee;

    @OneToOne(() => Candidate, (candidate) => candidate.user)
    candidate?: Candidate;

    @OneToMany(() => Notification, (notification) => notification.recipient)
    notifications: Notification[];

    @OneToMany(() => Referral, (referral) => referral.referrer)
    referralsMade: Referral[];

    @OneToMany(() => Referral, (referral) => referral.referred)
    referralsReceived: Referral[];
}
