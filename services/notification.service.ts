import Notification, {
    NotificaitonStatus,
} from "../entities/notification.entity";
import { ReferralStatus } from "../entities/referral.entity";
import HttpException from "../exception/httpException";
import NotificationRepository from "../repositories/notification.repository";
import { referralService } from "../routes/referral.route";
import { LoggerService } from "./logger.service";
import { personService } from "../routes/person.routes";

class NotificationService {
    constructor(private notificationRepository: NotificationRepository) {}
    private logger = LoggerService.getInstance(NotificationService.name);

    async notifyAllAdmins(title: string, content: string): Promise<void> {
        const allAdmins = await personService.getAllAdmins();

        const newNotifications: Notification[] = allAdmins.map((admin) => {
            const notification = new Notification();
            notification.title = title;
            notification.content = content;
            notification.recipient = admin;
            return notification;
        });

        await this.notificationRepository.create(newNotifications);
        this.logger.info(
            `Created ${newNotifications.length} notifications for all admins`
        );
    }

    async notifyPerson(
        title: string,
        content: string,
        recipient_id: number,
        referral_id: number
    ): Promise<void> {
        const recipient = await personService.getPersonById(recipient_id);
        if (!recipient) {
            throw new HttpException(
                404,
                `Person with id ${recipient_id} not found`
            );
        }

        const referral = await referralService.getReferralById(referral_id);
        if (!referral) {
            throw new HttpException(
                404,
                `Referral with id ${referral_id} not found`
            );
        }

        const notification = new Notification();
        notification.title = title;
        notification.content = content;
        notification.status = NotificaitonStatus.UNREAD;
        notification.recipient = recipient;
        notification.referral = referral;

        await this.notificationRepository.create([notification]);

        this.logger.info(`Notification sent to person ${recipient_id}`);
    }

    async notifyReferralStatusChange(
        referral_id: number
    ): Promise<void> {
        const referral = await referralService.getReferralById(referral_id);
        if (!referral) {
            throw new HttpException(
                404,
                `Referral with id ${referral_id} not found`
            );
        }

        const title = `Status Update: ${referral.status}`;
        let contentForCandidate = "";
        let contentForEmployee = "";

        switch (referral.status) {
            case ReferralStatus.REJECTED:
                contentForCandidate = "Sorry, you have been rejected.";
                contentForEmployee = `Unfortunately, your referral for ${referral.referred.name} has been rejected.`;
                break;
            case ReferralStatus.ACCEPTED:
                contentForCandidate =
                    "Congratulations! You have been accepted.";
                contentForEmployee = `Great news! Your referral for ${referral.referred.name} has been accepted.`;
                break;
            // Add more statuses as needed
            default:
                contentForCandidate = `Your referral status has been updated to: ${referral.status}`;
                contentForEmployee = `The referral for ${referral.referred.name} is now: ${referral.status}`;
        }

        await this.notifyPerson(
            title,
            contentForCandidate,
            referral.referred.id,
            referral_id
        );
        await this.notifyPerson(
            title,
            contentForEmployee,
            referral.referrer.id,
            referral_id
        );
    }

    async getNotificationsByReferralId(
        referral_id: number
    ): Promise<Notification[]> {
        const referral = await referralService.getReferralById(referral_id);
        if (!referral) {
            throw new HttpException(
                404,
                `Referral with id ${referral_id} not found`
            );
        }

        const notifications =
            await this.notificationRepository.findByReferralId(referral_id);
        this.logger.info(
            `All notifications fetched for referralId: ${referral_id}`
        );
        return notifications;
    }

    async getNotificationsByRecipientId(
        recipient_id: number
    ): Promise<Notification[]> {
        const person = await personService.getPersonById(recipient_id);
        if (!person) {
            throw new HttpException(
                404,
                `Person with id ${recipient_id} not found`
            );
        }

        const notifications =
            await this.notificationRepository.findByRecipientId(recipient_id);
        this.logger.info(
            `All notifications fetched for person: ${recipient_id}`
        );
        return notifications;
    }

    async updateNotification(
        id: number,
        updates: {
            title?: string;
            content?: string;
            status?: NotificaitonStatus;
            referralId?: number;
            recipientId?: number;
        }
    ): Promise<void> {
        const notification = await this.notificationRepository.findOneById(id);
        if (!notification) {
            throw new HttpException(
                404,
                `Notification with id ${id} not found`
            );
        }

        if (updates.title !== undefined) {
            notification.title = updates.title;
        }

        if (updates.content !== undefined) {
            notification.content = updates.content;
        }

        if (updates.status !== undefined) {
            if (!Object.values(NotificaitonStatus).includes(updates.status)) {
                throw new HttpException(400, `Invalid notification status`);
            }
            notification.status = updates.status;
        }

        if (updates.referralId !== undefined) {
            const referral = await referralService.getReferralById(
                updates.referralId
            );
            if (!referral) {
                throw new HttpException(
                    404,
                    `Referral with id ${updates.referralId} not found`
                );
            }
            notification.referral = referral;
        }

        if (updates.recipientId !== undefined) {
            const person = await personService.getPersonById(
                updates.recipientId
            );
            if (!person) {
                throw new HttpException(
                    404,
                    `Person with id ${updates.recipientId} not found`
                );
            }
            notification.recipient = person;
        }

        await this.notificationRepository.update(id, notification);
        this.logger.info(`Updated notification with id ${id}`);
    }

    async markAsRead(id: number): Promise<void> {
        const existingNotification = await this.notificationRepository.findOneById(id);
        if (!existingNotification) {
            throw new HttpException(404, `Notification with id:${id} not found`);
        }
        existingNotification.status = NotificaitonStatus.READ;
        this.logger.info(`Marked status of notification id:${id} as READ`);
        await this.notificationRepository.update(id,existingNotification)
    }
}

export default NotificationService;

