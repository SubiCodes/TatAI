import { config } from "dotenv";

// Load only the main .env file
config();

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY, CHATGPT_API } = process.env;
