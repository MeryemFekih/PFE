import * as dotenv from 'dotenv';
dotenv.config();

// Fallback-safe handling for both environments
export const BACKEND_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL ?? "http://localhost:4000"
    : process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
export const CHATBOT_API_KEY= process.env.CHATBOT_API_KEY ;