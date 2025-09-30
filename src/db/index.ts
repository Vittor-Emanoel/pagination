import { Pool } from "pg";

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
    const { rows } = await client.query(query, values);

    return { rows };
  } finally {
    client.release();
  }
}
