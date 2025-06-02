'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  requestResetCode,
  verifyResetCode,
  submitNewPassword,
} from '@/lib/resetpassword';

export default function ResetPasswordFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await requestResetCode(email);
    setLoading(false);
    setMessage(result?.message ?? 'An unexpected error occurred');
    if (result?.message?.includes('sent')) setStep(2);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyResetCode(email, code);
    setLoading(false);
    if (result?.message?.includes('success') || result?.message?.includes('verified')) {
      setStep(3);
    } else {
      setMessage(result?.message ?? 'An unexpected error occurred');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setMessage('Passwords do not match');
    setLoading(true);
    const result = await submitNewPassword(email, code, password);
    setLoading(false);
    setMessage(result?.message ?? 'An unexpected error occurred');
    if (result?.message?.includes('success')) setTimeout(() => router.push('/auth/signIn'), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify Code' : 'Set New Password'}
        </h2>

        <form
          onSubmit={step === 1 ? handleSendCode : step === 2 ? handleVerifyCode : handleResetPassword}
          className="space-y-4"
        >
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
            disabled={step > 1}
          />

          {/* 6-digit Code Input */}
          {step === 2 && (
            <div className="flex justify-center gap-2 mt-2">
              {[0, 1, 2, 3, 4, 5].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  className="w-10 h-12 rounded-md bg-gray-200 text-center text-lg font-bold outline-none  shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] transition duration-300 ease-in-out hover:bg-gray-300 focus:bg-gray-300"
                  value={code[idx] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, '');
                    if (!newValue) return;
                    const newCode = code.split('');
                    newCode[idx] = newValue[0];
                    const updatedCode = newCode.join('');
                    setCode(updatedCode);

                    // Auto-focus next input
                    const nextInput = document.getElementById(`code-${idx + 1}`);
                    if (nextInput) (nextInput as HTMLInputElement).focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !code[idx]) {
                      const prevInput = document.getElementById(`code-${idx - 1}`);
                      if (prevInput) (prevInput as HTMLInputElement).focus();
                    }
                  }}
                  id={`code-${idx}`}
                />
              ))}
            </div>
          )}

          {/* Password Inputs */}
          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-900 hover:from-blue-900/90 hover:to-blue-700/90 
                                        text-white py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                        text-lg font-semibold h-12 flex items-center justify-center"
          >
            {loading
              ? 'Processing...'
              : step === 1
              ? 'Send Reset Code'
              : step === 2
              ? 'Verify Code'
              : 'Reset Password'}
          </button>
        </form>

        {/* Message Output */}
        {message && <p className="text-center text-sm text-indigo-700 font-medium mt-2">{message}</p>}
      </div>
    </div>
  );
}
