/* eslint-disable no-console */
import 'dotenv/config';
import { Pool } from 'pg';

import { inProduction } from 'src/constants';

export class DatabaseService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: inProduction
        ? process.env.DB_CONNECTION_STRING
        : process.env.DEV_DB_CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.pool.on('connect', () => {
      console.log('connected to the database');
    });

    this.pool.on('error', (e) => {
      console.log(`error connecting to the database ${e.message}`);
    });
  }

  async query(text: string, params?: string[]) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  }

  async endConnection() {
    await this.pool.end();
  }
}
