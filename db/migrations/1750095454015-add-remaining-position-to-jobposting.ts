import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRemainingPositionToJobposting1750095454015 implements MigrationInterface {
    name = 'AddRemainingPositionToJobposting1750095454015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_posting" ADD "remaining_positions" integer`);
        await queryRunner.query(`UPDATE "job_posting" SET "remaining_positions" = "num_of_positions"`);
        await queryRunner.query(`ALTER TABLE "job_posting" ALTER COLUMN "remaining_positions" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_posting" DROP COLUMN "remaining_positions"`);
    }

}
