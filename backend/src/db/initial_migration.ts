/* eslint-disable no-console */
import { DatabaseService } from './database.service';
import { createLoansTable, dropLoansTable } from './queries/loan';
import {
  createLoanOffersTable,
  dropLoanOffersTable,
} from './queries/loanOffer';
import {
  createLoanRepaymentsTable,
  dropLoanRepaymentsTable,
} from './queries/loanRepayment';
import { createUsersTable, dropUsersTable } from './queries/user';

const databaseService = new DatabaseService();

/**
 * @description Runs a database migration which creates all database table creation
 */
const runMigration = async () => {
  try {
    await databaseService.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await databaseService.query(dropUsersTable);
    await databaseService.query(dropLoanOffersTable);
    await databaseService.query(dropLoansTable);
    await databaseService.query(dropLoanRepaymentsTable);

    await databaseService.query(createUsersTable);
    await databaseService.query(createLoanOffersTable);
    await databaseService.query(createLoansTable);
    await databaseService.query(createLoanRepaymentsTable);

    console.log('DB migration successful');
  } catch (error) {
    console.log(`Error: ${JSON.stringify(error, ['code'], 2)}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
runMigration();
