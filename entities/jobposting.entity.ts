import { Column, Entity, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Referral from "./referral.entity";

@Entity()
class JobPosting extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    skills: string;

    @Column()
    location: string;

    @Column()
    numOfPositions: number;

    @Column()
    remainingPositions: number;

    @Column()
    experience: number;

    @Column()
    salary: number;

    @OneToMany( () => Referral, (referral) => referral.jobPosting)
    referrals: Referral[];

    @Column()
    bonusForReferral: number;
}

export default JobPosting;
