import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReferralAndJobpostingEntity1750307505994 implements MigrationInterface {
    name = 'UpdateReferralAndJobpostingEntity1750307505994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_posting" RENAME COLUMN "remaining_positions" TO "filled_positions"`);
        await queryRunner.query(`UPDATE "job_posting" SET "filled_positions" = 0`);
        await queryRunner.query(`ALTER TABLE "referral" DROP COLUMN "current_round"`);
        await queryRunner.query(`ALTER TABLE "job_posting" ALTER COLUMN "filled_positions" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_posting" ALTER COLUMN "filled_positions" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "referral" ADD "current_round" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "job_posting" RENAME COLUMN "filled_positions" TO "remaining_positions"`);
    }

}
