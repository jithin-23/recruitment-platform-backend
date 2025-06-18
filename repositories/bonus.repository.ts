import { FindManyOptions, Repository } from "typeorm";
import Bonus from "../entities/bonus.entity";

class BonusRepository {
  constructor(private repository: Repository<Bonus>) {}

  async create(bonus: Bonus): Promise<Bonus> {
    return this.repository.save(bonus);
  }

  async findMany(): Promise<Bonus[]> {
    return this.repository.find({
      relations: {
        referral: {
          referred:true,
          referrer:true
        },
      },
    });
  }

  async findOneById(id: number): Promise<Bonus | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
         referral: {
          referred:true,
          referrer:true
        },
      },
    });
  }

  async update(id: number, bonus: Partial<Bonus>): Promise<void> {
    await this.repository.update(id, bonus);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  async remove(bonus: Bonus): Promise<void> {
    await this.repository.remove(bonus);
  }

  async find(options: FindManyOptions<Bonus>): Promise<Bonus[]> {
    return this.repository.find(options);
  }
}

export default BonusRepository;
