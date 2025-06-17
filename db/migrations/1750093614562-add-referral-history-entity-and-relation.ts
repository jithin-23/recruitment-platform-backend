import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferralHistoryEntityAndRelation1750093614562 implements MigrationInterface {
    name = 'AddReferralHistoryEntityAndRelation1750093614562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referral_status_history" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."referral_status_enum" NOT NULL, "referral_id" integer, CONSTRAINT "PK_47239cd915f4064538e26c522a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "referral_status_history" ADD CONSTRAINT "FK_4171c050c54ab67828e5e88b0fc" FOREIGN KEY ("referral_id") REFERENCES "referral"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_status_history" DROP CONSTRAINT "FK_4171c050c54ab67828e5e88b0fc"`);
        await queryRunner.query(`DROP TABLE "referral_status_history"`);
    }

}
