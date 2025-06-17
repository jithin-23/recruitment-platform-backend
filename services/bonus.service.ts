import { LoggerService } from "./logger.service";
import BonusRepository from "../repositories/bonus.repository";
import Bonus from "../entities/bonus.entity";

class BonusService {
  private logger = LoggerService.getInstance(BonusService.name);

  constructor(private bonusRepository: BonusRepository) {}

  async getAllBonuses(): Promise<Bonus[]> {
    this.logger.info("Fetching all bonuses");
    return this.bonusRepository.findMany();
  }
}

export default BonusService;
