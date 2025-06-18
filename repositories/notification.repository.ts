import { Repository } from "typeorm";
import Notification from "../entities/notification.entity";

class NotificationRepository {
    constructor(private repository: Repository<Notification>) {}

    async create(notifications: Notification[]): Promise<Notification[]> {
        return this.repository.save(notifications);
    }

    async findMany(): Promise<Notification[]> {
        return this.repository.find();
    }

    async findOneById(id: number): Promise<Notification> {
        return this.repository.findOne({
            where: { id: id },
        });
    }


    async findByRecipientAndReferralId(recipient_id: number,referral_id:number): Promise<Notification[]> {
        return this.repository.find({
            where: { recipient: { id: recipient_id } ,referral: { id: referral_id }},
        });
    }

     async findByRecipientId(recepient_id: number): Promise<Notification[]> {
        return this.repository.find({
            where: { recipient: { id: recepient_id } },
        });
    }

    async findByReferralId(referral_id: number): Promise<Notification[]> {
        return this.repository.find({
            where: { referral: { id: referral_id } },
        });
    }

    async update(id: number, notification: Notification): Promise<void> {
        await this.repository.save({ id, ...notification });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }
}

export default NotificationRepository;
