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
        router.put("/:id", this.updateReferral.bind(this));
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

    async updateReferral(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const updateReferralDto = req.body; // Partial<Referral> expected
            const updatedReferral = await this.referralService.updateReferral(id, updateReferralDto);
            res.status(200).json(updatedReferral);
        } catch (error) {
            next(error);
        }
    }
}

export default ReferralController;