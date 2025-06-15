import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllTables1749959865249 implements MigrationInterface {
    name = 'CreateAllTables1749959865249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job_posting" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "description" character varying NOT NULL, "skills" character varying NOT NULL, "location" character varying NOT NULL, "num_of_positions" integer NOT NULL, "experience" integer NOT NULL, "salary" integer NOT NULL, "bonus_for_referral" integer NOT NULL, CONSTRAINT "PK_d7f4b8ed39caa6897bbdec8ba56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "joining_date" TIMESTAMP NOT NULL, "password" character varying NOT NULL, "person_id" integer, CONSTRAINT "REL_84c9ced19362dcb45e274accf8" UNIQUE ("person_id"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "years_of_experience" integer NOT NULL, "person_id" integer, CONSTRAINT "REL_0438bc34a12c2b116fd13b0191" UNIQUE ("person_id"), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum" AS ENUM('READ', 'UNREAD')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "content" character varying NOT NULL, "status" "public"."notification_status_enum" NOT NULL DEFAULT 'UNREAD', "recipient_id" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."person_role_enum" AS ENUM('ADMIN', 'EMPLOYEE', 'CANDIDATE')`);
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."person_role_enum" NOT NULL, CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c" UNIQUE ("email"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bonus_bonus_status_enum" AS ENUM('NOT_DUE', 'DUE', 'SETTLED')`);
        await queryRunner.query(`CREATE TABLE "bonus" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "bonus_amount" integer NOT NULL, "bonus_status" "public"."bonus_bonus_status_enum" NOT NULL DEFAULT 'NOT_DUE', "trigger_date" TIMESTAMP NOT NULL, "referral_id" integer NOT NULL, CONSTRAINT "REL_6eca34324e0f75d9211bbb2b1a" UNIQUE ("referral_id"), CONSTRAINT "PK_885c9ca672f42874b1a5cb4d9e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."referral_status_enum" AS ENUM('Referral Submitted', 'Referral Under Review', 'Referral Accepted', 'Interviews Ongoing', 'Interviews Completed', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "referral" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "current_round" integer NOT NULL DEFAULT '0', "status" "public"."referral_status_enum" NOT NULL DEFAULT 'Referral Submitted', "job_posting_id" integer, "referrer_id" integer, "referred_id" integer, "resume_id" integer, CONSTRAINT "REL_1a4879a67dd4aa7a281c454da5" UNIQUE ("resume_id"), CONSTRAINT "PK_a2d3e935a6591168066defec5ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resume" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_path" character varying NOT NULL, "resume_score" integer, "skills" character varying, CONSTRAINT "PK_7ff05ea7599e13fac01ac812e48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."interview_status_enum" AS ENUM('PASSED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "interview" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "round_number" integer NOT NULL, "status" "public"."interview_status_enum" NOT NULL, "candidate_id" integer, "job_id" integer, CONSTRAINT "PK_44c49a4feadefa5c6fa78bfb7d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_84c9ced19362dcb45e274accf8f" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_0438bc34a12c2b116fd13b01911" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_9830357f52360a126737d498e66" FOREIGN KEY ("recipient_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bonus" ADD CONSTRAINT "FK_6eca34324e0f75d9211bbb2b1a7" FOREIGN KEY ("referral_id") REFERENCES "referral"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_b7c14964da64c4d8ae348207238" FOREIGN KEY ("job_posting_id") REFERENCES "job_posting"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_f79e4f8d7f796b3fcb16894b527" FOREIGN KEY ("referrer_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_548b0c038adaf318acc54d19ce6" FOREIGN KEY ("referred_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_1a4879a67dd4aa7a281c454da5d" FOREIGN KEY ("resume_id") REFERENCES "resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_3aec56b0feb4008c1e63abd3c3b" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_7e40d34000df74377fb31d4bf11" FOREIGN KEY ("job_id") REFERENCES "job_posting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_7e40d34000df74377fb31d4bf11"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_3aec56b0feb4008c1e63abd3c3b"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_1a4879a67dd4aa7a281c454da5d"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_548b0c038adaf318acc54d19ce6"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_f79e4f8d7f796b3fcb16894b527"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_b7c14964da64c4d8ae348207238"`);
        await queryRunner.query(`ALTER TABLE "bonus" DROP CONSTRAINT "FK_6eca34324e0f75d9211bbb2b1a7"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_9830357f52360a126737d498e66"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_0438bc34a12c2b116fd13b01911"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_84c9ced19362dcb45e274accf8f"`);
        await queryRunner.query(`DROP TABLE "interview"`);
        await queryRunner.query(`DROP TYPE "public"."interview_status_enum"`);
        await queryRunner.query(`DROP TABLE "resume"`);
        await queryRunner.query(`DROP TABLE "referral"`);
        await queryRunner.query(`DROP TYPE "public"."referral_status_enum"`);
        await queryRunner.query(`DROP TABLE "bonus"`);
        await queryRunner.query(`DROP TYPE "public"."bonus_bonus_status_enum"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TYPE "public"."person_role_enum"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "job_posting"`);
    }

}
