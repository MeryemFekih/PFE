import * as dotenv from 'dotenv';

dotenv.config(); 

export const NEXT_PUBLIC_BACKEND_URL= process.env.BACKEND_URL ;

export const CHATBOT_API_KEY= process.env.CHATBOT_API_KEY ;