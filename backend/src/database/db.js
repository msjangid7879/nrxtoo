import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

export const pool = new Pool(config.database);

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected client error:', err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (config.nodeEnv === 'development' && duration > 500) {
      console.log(`[PostgreSQL Slow Query] ${duration}ms: ${text.slice(0, 100)}...`);
    }
    return res;
  } catch (err) {
    console.error(`[PostgreSQL Query Error] ${err.message}\nQuery: ${text}`);
    throw err;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('[PostgreSQL] Connected successfully at:', res.rows[0].now);
    return true;
  } catch (err) {
    console.warn('[PostgreSQL Connection Warning]:', err.message);
    return false;
  }
};
