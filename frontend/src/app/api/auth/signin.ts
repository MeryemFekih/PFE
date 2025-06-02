// src/apis/auth.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:3001', // ✅ Must point to your backend
});

export const signIn = async (data: { email: string; password: string }) => {
  return await API.post('/auth/signin', data);
};
