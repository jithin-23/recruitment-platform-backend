import { Column, Entity } from "typeorm";
import AbstractEntity from "./abstract.entity";

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
    experience: number;

    @Column()
    salary: number;
}

export default JobPosting;
