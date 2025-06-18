import { NextFunction, Request, Response, Router } from "express";
import ReferralService from "../services/referral.service";
import { plainToInstance } from "class-transformer";
import { CreateReferralDto } from "../dto/create-referral-dto";
import { validate } from "class-validator";
import HttpException from "../exception/httpException";


class ReferralController {
    constructor(
        private referralService: ReferralService,
        private router: Router
    ) {
        router.post("/", this.createReferral.bind(this));
        router.get("/", this.getAllReferrals.bind(this));
        router.get("/:id", this.getReferralById.bind(this));
        router.get("/response/:id", this.getReferralResponseById.bind(this));
        router.get("/employee/:id", this.gerReferralByReferrerId.bind(this));
        router.patch("/:id", this.updateReferralStatus.bind(this));
    }

    async createReferral(req: Request, res: Response, next: NextFunction) {
        try {
            const createReferralDto = plainToInstance(CreateReferralDto, req.body);
            const errors = await validate(createReferralDto);
            if (errors.length > 0) {
                throw new HttpException(400, JSON.stringify(errors));
            }
            const savedReferral = await this.referralService.createReferral(createReferralDto);
            res.status(201).send(savedReferral);
        } catch (error) {
            next(error);
        }
    }
    
    async updateReferralStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const status = req.body.status; // Assuming status is sent in the request body
            if (!status) {
                throw new HttpException(400, "Status is required");
            }
            const updatedReferral = await this.referralService.updateStatus(id, status);
            res.status(200).json(updatedReferral);
        } catch (err) {
            next(err);
        }
    }

    async getAllReferrals(req: Request, res: Response) {
        const referrals = await this.referralService.getAllReferrals();
        res.status(200).send(referrals);
    }

    async getReferralById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const referral = await this.referralService.getReferralById(id);
            res.status(200).json(referral);
        } catch (err) {
            next(err);
        }
    }

       async getReferralResponseById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const referral = await this.referralService.getReferralResponse(id);
            res.status(200).json(referral);
        } catch (err) {
            next(err);
        }
    }

    async gerReferralByReferrerId(req: Request, res: Response, next: NextFunction) {
        try {
            const referrerId = Number(req.params.id);
            const referrals = await this.referralService.getReferralsByReferrer(referrerId);
            res.status(200).json(referrals);
        } catch (err) {
            next(err);
        }
    
}
}

export default ReferralController;