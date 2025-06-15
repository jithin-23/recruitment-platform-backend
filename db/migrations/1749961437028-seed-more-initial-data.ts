import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedMoreInitialData1749961437028 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO referral (
              id,
              current_round,
              status,
              job_posting_id,
              referrer_id,
              referred_id
            ) VALUES
              (1, 0, 'Referral Submitted', 1, 1, 3),
              (2, 1, 'Referral Under Review', 3, 4, 5);
        `);

        await queryRunner.query(`
            INSERT INTO referral (
              id,
              current_round,
              status,
              job_posting_id,
              referrer_id,
              referred_id,
              deleted_at
            ) VALUES
              (3, 0, 'Interviews Completed', 2, 2, 6, NOW());
        `);

        await queryRunner.query(`
            INSERT INTO bonus (
              bonus_amount,
              bonus_status,
              referral_id,
              trigger_date
            ) VALUES (
              15000,
              'NOT_DUE',
              3,
              NOW() + INTERVAL '6 months'
            );
        `);

        await queryRunner.query(`
            INSERT INTO notification (recipient_id, title, content, status) VALUES
              (1, 'Welcome', 'Welcome to the system, Alice!', 'UNREAD'),
              (2, 'Task Assigned', 'You have been assigned a new task.', 'UNREAD'),
              (3, 'Interview Scheduled', 'Your interview is scheduled for next week.', 'READ'),
              (4, 'Reminder', 'Dont forget to submit your timesheet.', 'UNREAD'),
              (5, 'Referral Update', 'Your referral status has been updated.', 'READ'),
              (6, 'Policy Change', 'Please review the updated company policies.', 'UNREAD');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM notification
            WHERE title IN (
                'Welcome',
                'Task Assigned',
                'Interview Scheduled',
                'Reminder',
                'Referral Update',
                'Policy Change'
            );
        `);

        await queryRunner.query(`
            DELETE FROM bonus
            WHERE referral_id = 3;
        `);

        await queryRunner.query(`
            DELETE FROM referral
            WHERE id IN (1, 2, 3);
        `);
    }
}
