import { config } from "dotenv";

// Load only the main .env file
config();

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET } = process.env;
