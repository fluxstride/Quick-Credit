/* eslint-disable no-console */
import { Pool } from 'pg';

const pool = new Pool({
  user: 'fluxstride',
  host: 'localhost',
  database: 'blog',
  password: 'postgres',
  port: 5432,
});

pool.on('connect', () => {
  console.log('connected to the database');
});
pool.on('error', (e) => {
  console.log(`error connecting to the database ${e.message}`);
});

export default {
  query: (text: string, params?: string[]) => pool.query(text, params),
  endConnection: () => pool.end(),
};
