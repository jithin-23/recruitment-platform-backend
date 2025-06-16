import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReferralAndNotificationEntity1750061851136 implements MigrationInterface {
    name = 'UpdateReferralAndNotificationEntity1750061851136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" DROP COLUMN "current_round"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "referral_id" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_cad6cc05ad209955696758bcc42" FOREIGN KEY ("referral_id") REFERENCES "referral"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_cad6cc05ad209955696758bcc42"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "referral_id"`);
        await queryRunner.query(`ALTER TABLE "referral" ADD "current_round" integer NOT NULL DEFAULT '0'`);
    }

}
