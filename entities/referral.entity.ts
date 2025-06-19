import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import JobPosting from "./jobposting.entity";
import { Person } from "./person.entity";
import Resume from "./resume.entity";
import Bonus from "./bonus.entity";
import Notification from "./notification.entity";
import ReferralStatusHistory from "./referralstatushistory.entity";

export enum ReferralStatus {
	REFERRAL_SUBMITTED = "Referral Submitted",
	REFERRAL_UNDER_REVIEW = "Referral Under Review",
	REFERRAL_ACCEPTED = "Referral Accepted",
	INTERVIEW_ROUND_1 = "Interviews Round 1",
	INTERVIEWS_ROUND_2 = "Interview Round 2",
  ACCEPTED = "Accepted",
	REJECTED = "Rejected",
}

@Entity()
class Referral extends AbstractEntity {
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

  @OneToMany(() => Notification, (notification) => notification.referral)
  notifications: Notification[]

  @OneToMany( () => ReferralStatusHistory, (history) => history.referral)
  histories: ReferralStatusHistory[];
}

export default Referral;
