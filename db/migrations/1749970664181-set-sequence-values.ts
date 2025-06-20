import { MigrationInterface, QueryRunner } from "typeorm";

export class SetSequenceValues1749970664181 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `SELECT setval('person_id_seq', (SELECT MAX(id) FROM person))`
        );
        await queryRunner.query(
            `SELECT setval('employee_id_seq', (SELECT MAX(id) FROM employee))`
        );
        await queryRunner.query(
            `SELECT setval('job_posting_id_seq', (SELECT MAX(id) FROM job_posting))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
