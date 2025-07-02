import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import config from '../config/config';

const pool: Pool = new Pool(config.db);

async function verifyConnection(): Promise<void> {
  try {
    const client: PoolClient = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release(); 
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
}

verifyConnection();

const db = {
  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    return pool.query<T>(text, params);
  },
  async getClient(): Promise<PoolClient> {
    return pool.connect();
  },
};

export default db;
