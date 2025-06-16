import { LoggerService } from "./logger.service";

class NotificaionService{
    constructor() {}
    private logger = LoggerService.getInstance(NotificaionService.name)

    async notifyAllAdmins() {}
    async notifyPersonById() {} 
}

export default NotificaionService;