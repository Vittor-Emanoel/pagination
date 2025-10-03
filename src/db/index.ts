import { Pool, type PoolClient } from "pg";

let pool: Pool;

function getPoll() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

export async function query(query: string, values?: any) {
  const pool = getPoll();
  const client = await pool.connect();

  try {
    const { rows, rowCount } = await client.query(query, values);

    return { rows, rowCount };
  } finally {
    client.release();
  }
}

export async function transaction(callback: (tx: PoolClient) => Promise<void>) {
  const pool = getPoll();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await callback(client);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
