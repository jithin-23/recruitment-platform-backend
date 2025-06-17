import { Column, Entity, ManyToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import { Person } from "./person.entity";
import Referral from "./referral.entity";

export enum NotificaitonStatus {
    READ = "READ",
    UNREAD = "UNREAD",
}

@Entity()
class Notification extends AbstractEntity {
    @ManyToOne(() => Person, (person) => person.notifications, {
        onDelete: "CASCADE",
    })
    recipient: Person;

    @ManyToOne( () => Referral, (referral) => referral.notifications, {
        onDelete: "SET NULL"
    })
    referral: Referral;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({
        type: "enum",
        enum: NotificaitonStatus,
        default: NotificaitonStatus.UNREAD,
    })
    status: NotificaitonStatus;
}

export default Notification;
