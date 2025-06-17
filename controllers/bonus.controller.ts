import { Request, Response, NextFunction, Router } from "express";
import BonusService from "../services/bonus.service";

class BonusController {
    constructor(private bonusService: BonusService, private router: Router) {
        router.get("/", this.getAllBonuses.bind(this));
        router.get("/employee/:id", this.getBonusesByEmployee.bind(this));
        router.patch("/:id", this.updateBonusStatus.bind(this));
    }

    async getAllBonuses(req: Request, res: Response, next: NextFunction) {
        try {
            const bonuses = await this.bonusService.getAllBonuses();
            res.status(200).json(bonuses);
        } catch (error) {
            next(error);
        }
    }

    async getBonusesByEmployee(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const employeeId = parseInt(req.params.id);
            const bonuses = await this.bonusService.getBonusesByEmployee(
                employeeId
            );
            res.status(200).json(bonuses);
        } catch (error) {
            next(error);
        }
    }

    async updateBonusStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const bonusId = parseInt(req.params.id);
            const { status } = req.body;

            if (!status) {
                return res
                    .status(400)
                    .json({ message: "Bonus status is required" });
            }

            const updatedBonus = await this.bonusService.updateBonusStatus(
                bonusId,
                status
            );
            res.status(200).json(updatedBonus);
        } catch (error) {
            next(error);
        }
    }
}

export default BonusController;
