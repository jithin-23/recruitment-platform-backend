import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Referral from "./referral.entity";

@Entity()
class Resume extends AbstractEntity {
    @Column()
    filePath: string;

    @Column({ nullable: true })
    resumeScore: number;

    @Column({ nullable: true })
    skills: string;

    @OneToOne( () => Referral, (referral) => referral.resume, {
        onDelete: "CASCADE"
    })
    referral: Referral;

}

export default Resume;
