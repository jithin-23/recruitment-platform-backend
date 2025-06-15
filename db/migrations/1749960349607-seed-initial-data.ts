import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1749960349607 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO person (id, name, phone, email, role) VALUES
            (1,'Alice Johnson', '1234567890', 'alice@example.com', 'ADMIN'),
            (2,'Bob Smith', '0987654321', 'bob@example.com', 'EMPLOYEE'),
            (3,'Carol Lee', '5555555555', 'carol@example.com', 'CANDIDATE'),
            (4,'David Miller', '9876543210', 'david.miller@example.com', 'EMPLOYEE'),
            (5,'Eva Green', '1112223333', 'eva.green@example.com', 'CANDIDATE'),
            (6,'Frank Harris', '4445556666', 'frank.harris@example.com', 'ADMIN');
        `);

        await queryRunner.query(`
            INSERT INTO employee (id,joining_date, password, person_id) VALUES
            (1,'2023-01-15', 'password', 1),
            (2,'2022-08-30', 'password', 2),
            (3,'2024-03-01', 'password', 4),
            (4,'2023-11-20', 'password', 6);
        `);

        await queryRunner.query(`
            INSERT INTO candidate (id,years_of_experience, person_id) VALUES
            (1, 4, 3),
            (2, 2, 5);
        `);

        await queryRunner.query(`
            INSERT INTO job_posting (
                id,
                title, 
                description, 
                skills, 
                location, 
                num_of_positions, 
                experience, 
                salary, 	
                bonus_for_referral
            ) VALUES
            (
                1,
                'Frontend Developer',
                'Looking for a skilled React developer to join our team.',
                'JavaScript, React, HTML, CSS',
                'Bangalore',
                2,
                3,
                900000,
                10000
            ),
            (
                2,
                'Backend Developer',
                'Responsible for API development and database design.',
                'Node.js, Express, PostgreSQL',
                'Hyderabad',
                1,
                4,
                1200000,
                15000
            ),
            (
                3,
                'Data Analyst',
                'Analyze business data and generate insights.',
                'Python, SQL, Excel, PowerBI',
                'Remote',
                3,
                2,
                800000,
                8000
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM job_posting WHERE id IN (1,2,3);`);
        await queryRunner.query(
            `DELETE FROM candidate WHERE person_id IN (3, 5);`
        );
        await queryRunner.query(
            `DELETE FROM employee WHERE person_id IN (1, 2, 4, 6);`
        );
        await queryRunner.query(
            `DELETE FROM person WHERE id IN (1, 2, 3, 4, 5, 6);`
        );
    }
}
