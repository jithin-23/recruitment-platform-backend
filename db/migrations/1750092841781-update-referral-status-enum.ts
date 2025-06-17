import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReferralStatusEnum1750092841781 implements MigrationInterface {
    name = 'UpdateReferralStatusEnum1750092841781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM referral WHERE status = 'Interviews Completed';`)
        await queryRunner.query(`ALTER TYPE "public"."referral_status_enum" RENAME TO "referral_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."referral_status_enum" AS ENUM('Referral Submitted', 'Referral Under Review', 'Referral Accepted', 'Interviews Round 1', 'Interview Round 2', 'Accepted', 'Rejected')`);
        await queryRunner.query(`ALTER TABLE "referral" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "referral" ALTER COLUMN "status" TYPE "public"."referral_status_enum" USING "status"::"text"::"public"."referral_status_enum"`);
        await queryRunner.query(`ALTER TABLE "referral" ALTER COLUMN "status" SET DEFAULT 'Referral Submitted'`);
        await queryRunner.query(`DROP TYPE "public"."referral_status_enum_old"`);
        await queryRunner.query(`INSERT INTO referral (
              id,
              current_round,
              status,
              job_posting_id,
              referrer_id,
              referred_id,
              deleted_at
            ) VALUES
              (3, 0, 'Accepted', 2, 2, 6, NOW());
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."referral_status_enum_old" AS ENUM('Referral Submitted', 'Referral Under Review', 'Referral Accepted', 'Interviews Ongoing', 'Interviews Completed', 'Rejected')`);
        await queryRunner.query(`ALTER TABLE "referral" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "referral" ALTER COLUMN "status" TYPE "public"."referral_status_enum_old" USING "status"::"text"::"public"."referral_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "referral" ALTER COLUMN "status" SET DEFAULT 'Referral Submitted'`);
        await queryRunner.query(`DROP TYPE "public"."referral_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."referral_status_enum_old" RENAME TO "referral_status_enum"`);
    }

}
