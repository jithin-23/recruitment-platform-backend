import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationBetweenNotificationAndReferral1750092121362 implements MigrationInterface {
    name = 'AddRelationBetweenNotificationAndReferral1750092121362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "referral_id" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_cad6cc05ad209955696758bcc42" FOREIGN KEY ("referral_id") REFERENCES "referral"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_cad6cc05ad209955696758bcc42"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "referral_id"`);
    }

}
