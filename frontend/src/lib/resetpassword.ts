'use server';

import { forgotPassword, resetPassword } from '@/lib/auth';
import { BACKEND_URL } from './constants';
import { FormState } from './schemas';

export async function requestResetCode(email: string) {
  return await forgotPassword(email);
}

export async function verifyResetCode(email: string, code: string) {
  return await resetPassword(email, code, 'TEMP__');
}

export async function submitNewPassword(email: string, resetCode: string, password: string): Promise<FormState> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetCode, newPassword: password }),
    });

    const result = await res.json();
    return { message: result.message };
  } catch (e) {
    return { message: 'Unexpected error. Please try again.' };
  }
}
