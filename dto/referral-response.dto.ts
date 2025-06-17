import { ReferralStatus } from "../entities/referral.entity";
import ReferralStatusHistory from "../entities/referralstatushistory.entity";

export class ReferralResponseDto {
  id: number;
  candidateName: string;
  position: string;
  referredBy: string;
  submittedDate: Date;
  currentStatus: string;
  histories: ReferralStatusHistory [];
  failedAt: string;
}
