'use client';

import { useActionState, useState } from 'react';
import { signIn } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubmitButton from '@/components/ui/submitButton'

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, action] = useActionState(signIn, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form action={action}>
        <Card className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden border-0">
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8 
                          bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI1IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMTIzLCAyNTUsIDAuMDgpIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')]">
              <div className="text-center space-y-4">
                <div className="w-30 h-30 rounded-full bg-gradient-to-r from-blue-500 to-indigo-900 flex items-center justify-center mx-auto 
                              shadow-inner ">
                  <img src="/images/logo.png" alt="BrainWave Logo" className="h-35 w-30 object-contain" />
                  {/*  bg-gradient-to-r from-blue-500 to-indigo-900*/}

                </div>
                <h2 className="text-3xl font-bold  bg-clip-text bg-gradient-to-r from-blue-400 to-blue-900 text-transparent">
                  BrainWave
                </h2>
                <p className="text-gray-600 mt-2 text-lg">Join our growing community</p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className="w-full md:w-4/5">
              <CardHeader className=" p-10 pb-2 ">
                <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
                <p className="text-lg text-gray-600 mt-2">Sign in to continue your journey</p>
              </CardHeader>
              
              <CardContent className="p-10 pt-6 space-y-6">
                {state?.message && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                    {state.message}
                  </div>
                )}
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      name='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="focus:border-2 bg-gray-100 focus:border-blue-800 h-12 text-lg px-4 py-3"
                    />
                    {state?.error?.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {state.error.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      name='password'
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="focus:border-2 bg-gray-100 focus:border-blue-800 h-12 text-lg px-4 py-3"
                    />
                    {state?.error?.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {state.error.password}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-5 items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-5 w-5 rounded-full bg-blue-100"
                      />
                      <label htmlFor="remember-me" className="ml-1 block text-md text-gray-700">
                        Remember this device
                      </label>
                    </div>
                    
                    <a href="/auth/forgot-password" className="text-md font-medium text-customBlue hover:underline hover:text-customBlue/80 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  
                  <SubmitButton className="w-full bg-gradient-to-r from-blue-500 to-indigo-900 hover:from-blue-900/90 hover:to-blue-700/90 
                                        text-white py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                        text-lg font-semibold h-12 flex items-center justify-center">
                    <span>Sign In</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </SubmitButton>
                </div>
                
                <div className="mt-8 text-center text-md text-gray-600">
                  New to our platform?{' '}
                  <a href="/auth/signUp" className="font-semibold text-customBlue hover:underline hover:text-customBlue/80 transition-colors">
                    Create an account
                  </a>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SignInPage;