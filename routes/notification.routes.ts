import express from "express";
import NotificationRepository from "../repositories/notification.repository";
import dataSource from "../db/data-source";
import Notification from "../entities/notification.entity";
import NotificationService from "../services/notification.service";
import NotificationController from "../controllers/notification.controller";

const notificationRouter = express.Router();
const notificationRepository = new NotificationRepository(dataSource.getRepository(Notification));
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService, notificationRouter);

export default notificationRouter;
export {notificationService};