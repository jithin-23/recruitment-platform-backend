import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import Candidate from "./candidate.entity";
import JobPosting from "./jobposting.entity";
import AbstractEntity from "./abstract.entity";

export enum InterviewStatus {
  PASSED = "PASSED",
  FAILED = "FAILED",
}

@Entity()
class Interview extends AbstractEntity {
  @Column()
  roundNumber: number;

  @Column({
    type: "enum",
    enum: InterviewStatus,
    nullable: false,
  })
  status: InterviewStatus;

  @ManyToOne(() => Candidate)
  candidate: Candidate;

  @ManyToOne(() => JobPosting)
  job: JobPosting;
}

export default Interview;