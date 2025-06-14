import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Referral from "./referral.entity";

export enum BonusStatus {
    NOT_DUE = "NOT_DUE",
    DUE = "DUE",
    SETTLED = "SETTLED",
}

@Entity()
class Bonus extends AbstractEntity {
    @Column("decimal", { precision: 10, scale: 2 })
    bonusAmount: number;

    @Column({
        type: "enum",
        enum: BonusStatus,
        default: BonusStatus.NOT_DUE,
    })
    bonusStatus: BonusStatus;

    @OneToOne(() => Referral, { onDelete: "CASCADE", nullable: false })
    @JoinColumn()
    referral: Referral;

    @Column()
    triggerDate: Date;
}

export default Bonus;