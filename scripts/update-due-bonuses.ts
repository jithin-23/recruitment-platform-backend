// scripts/update-due-bonuses.ts

import 'reflect-metadata';
import 'dotenv/config';
import dataSource from '../db/data-source';
import BonusService from '../services/bonus.service';
import BonusRepository from '../repositories/bonus.repository';
import Bonus from '../entities/bonus.entity';
import { referralService } from '../routes/referral.route';
import { notificationService } from '../routes/notification.routes';

const runBonusUpdate = async () => {
    console.log('Starting bonus status update script...');
    try {
        await dataSource.initialize();
        console.log('Database connection initialized.');

        // Manually instantiate the service for the script
        const bonusRepository = new BonusRepository(dataSource.getRepository(Bonus));
        // Ensure notificationService and referralService are initialized if they have dependencies
        // For this script, we'll use the already exported instances from their respective route files
        const bonusService = new BonusService(bonusRepository, referralService);

        const updatedCount = await bonusService.updateOverdueBonuses();
        console.log(`Script finished. Updated ${updatedCount} bonus records.`);

    } catch (error) {
        console.error('An error occurred during the bonus update script:', error);
        process.exit(1);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('Database connection closed.');
        }
    }
};

runBonusUpdate();
