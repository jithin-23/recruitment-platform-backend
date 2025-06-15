import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import JobPosting from "./jobposting.entity";
import { Person } from "./person.entity";
import Resume from "./resume.entity";
import Bonus from "./bonus.entity";

export enum ReferralStatus {
  REFERRAL_SUBMITTED = "Referral Submitted",
  REFERRAL_UNDER_REVIEW = "Referral Under Review",
  REFERRAL_ACCEPTED = "Referral Accepted",
  INTERVIEWS_ONGOING = "Interviews Ongoing",
  INTERVIEWS_COMPLETED = "Interviews Completed",
  REJECTED = "Rejected",
}

@Entity()
class Referral extends AbstractEntity {
  @Column({ default: 0 })
  currentRound: number;

  @Column({
    type: "enum",
    enum: ReferralStatus,
    default: ReferralStatus.REFERRAL_SUBMITTED,
  })
  status: ReferralStatus;

  @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.referrals, {
    onDelete: "CASCADE",
  })
  jobPosting: JobPosting;

  @ManyToOne(() => Person, (person) => person.referralsMade, {
    onDelete: "CASCADE",
  })
  referrer: Person;

  @ManyToOne(() => Person, (person) => person.referralsReceived, {
    onDelete: "CASCADE",
  })
  referred: Person;

  @OneToOne(() => Resume, (resume) => resume.referral, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  resume?: Resume;

  @OneToOne(() => Bonus, (bonus) => bonus.referral)
  bonus: Bonus;
}

export default Referral;
