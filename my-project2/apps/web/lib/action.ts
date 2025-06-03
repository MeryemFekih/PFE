"use server";


import { authFetch } from "./authFetch";
import { NEXT_PUBLIC_BACKEND_URL } from "./constants";

export const getProfile = async () => {
  const response = await authFetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/protected`);

  const result = await response.json();
  return result;
};