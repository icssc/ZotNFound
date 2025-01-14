import { Client } from "pg";

const client = new Client({
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  host: process.env.AWS_HOST,
  port: process.env.AWS_PORT,
  database: process.env.AWS_DB_NAME,
  ssl: { rejectUnauthorized: false },
});
client.connect();

export default client;