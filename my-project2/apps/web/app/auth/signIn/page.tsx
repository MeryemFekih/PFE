'use client';

import { useActionState, useState } from 'react';
import { signIn } from '@/lib/auth';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import SubmitButton from '@/app/components/ui/submitButton';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, action] = useActionState(signIn, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form action={action}>
        <Card className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden border-0">
          <div className="flex flex-col md:flex-row">
            {/* Brand/Illustration Section */}
            <div className="hidden md:flex w-full md:w-2/5 bg-customBlue/5 items-center justify-center p-8 
                          bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI1IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMTIzLCAyNTUsIDAuMDgpIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')]">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-customBlue/10 flex items-center justify-center mx-auto 
                              shadow-inner border border-customBlue/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-customBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-customBlue to-blue-600 text-transparent">
                  BrainWave
                </h2>
                <p className="text-gray-600 mt-2 text-lg">Join our growing community</p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className="w-full md:w-3/5">
              <CardHeader className="p-10 pb-6 border-b">
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
                      className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-lg px-4 py-3"
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
                      className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-lg px-4 py-3"
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-5 w-5 text-customBlue focus:ring-customBlue border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-md text-gray-700">
                        Remember this device
                      </label>
                    </div>
                    
                    <a href="#" className="text-md font-medium text-customBlue hover:underline hover:text-customBlue/80 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  
                  <SubmitButton className="w-full bg-gradient-to-r from-customBlue to-blue-600 hover:from-customBlue/90 hover:to-blue-600/90 
                                        text-white py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                        text-lg font-semibold h-12 flex items-center justify-center">
                    <span>Sign In</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </SubmitButton>
                </div>
                
                <div className="mt-8 text-center text-lg text-gray-600">
                  New to our platform?{' '}
                  <a href="/auth/signup" className="font-semibold text-customBlue hover:underline hover:text-customBlue/80 transition-colors">
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