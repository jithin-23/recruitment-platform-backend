import {
    Entity,
    Column,
    ManyToOne,
  } from "typeorm";
  import AbstractEntity from "./abstract.entity";
  import Referral, { ReferralStatus } from "./referral.entity";
  
  
  @Entity()
  class ReferralStatusHistory extends AbstractEntity {
    
    @Column({
      type: "enum",
      enum: ReferralStatus,
      enumName: "referral_status_enum",
      nullable: false
    })
    status: ReferralStatus;
  
    @ManyToOne(() => Referral, (referral) => referral.histories)
    referral: Referral;
  }
  
  export default ReferralStatusHistory;