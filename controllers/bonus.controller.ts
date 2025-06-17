import { Request, Response, NextFunction, Router } from "express";
import BonusService from "../services/bonus.service";

class BonusController {
  constructor(private bonusService: BonusService, private router: Router) {
    router.get("/", this.getAllBonuses.bind(this));
  }

  async getAllBonuses(req: Request, res: Response, next: NextFunction) {
    try {
      const bonuses = await this.bonusService.getAllBonuses();
      res.status(200).json(bonuses);
    } catch (error) {
      next(error);
    }
  }
}

export default BonusController;
