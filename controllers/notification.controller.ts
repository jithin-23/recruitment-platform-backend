import { NextFunction, Request, Response, Router } from "express";
import NotificationService from "../services/notification.service";

class NotificationController {
    constructor(
        private notificationService: NotificationService,
        private router: Router
    ) {
        router.get(
            "/referral/:id",
            this.getNotificationsByReferralId.bind(this)
        );
        router.get("/person/:id", this.getNotificationByPersonId.bind(this));
        router.patch("/:id/read", this.markAsRead.bind(this));

        // ✅ Test routes
        router.put("/:id", this.updateNotification.bind(this));
        router.post("/notify/admins", this.notifyAllAdmins.bind(this));
        router.post("/notify/person", this.notifyPerson.bind(this));
    }

    async getNotificationsByReferralId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const referral_id = Number(req.params.id);
            const notifications =
                await this.notificationService.getNotificationsByReferralId(
                    referral_id
                );
            res.status(200).send(notifications);
        } catch (error) {
            next(error);
        }
    }

    async getNotificationByPersonId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const recipient_id = Number(req.params.id);
            const notifications =
                await this.notificationService.getNotificationsByRecipientId(
                    recipient_id
                );
            res.status(200).send(notifications);
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await this.notificationService.markAsRead(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    //Test Controller
    async notifyAllAdmins(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, content } = req.body;
            if (!title || !content) {
                return res
                    .status(400)
                    .send({ message: "title and content are required" });
            }

            await this.notificationService.notifyAllAdmins(title, content);
            res.status(201).send({
                message: "Notifications sent to all admins",
            });
        } catch (error) {
            next(error);
        }
    }

    // ✅ Notify a specific person about a referral
    async notifyPerson(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, content, recipient_id, referral_id } = req.body;

            if (
                !title ||
                !content ||
                typeof recipient_id !== "number" ||
                typeof referral_id !== "number"
            ) {
                return res.status(400).send({
                    message:
                        "title, content, recipient_id and referral_id are required and must be valid",
                });
            }

            await this.notificationService.notifyPerson(
                title,
                content,
                recipient_id,
                referral_id
            );

            res.status(201).send({
                message: `Notification sent to person ${recipient_id}`,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await this.notificationService.updateNotification(id, req.body);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default NotificationController;
