'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';

import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import Image from 'next/image';


const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (email === 'user@example.com' && password === 'password') {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen  w-full h-full p-8" >
      <Card className="min-w-[100px] md:min-w-[200px] lg:min-w-[350px] w-full max-w-[350px]  h-auto shadow-lg bg-background" >
        <CardHeader>  
          <CardTitle  className="text-xl  text-customBlue ">Sign In</CardTitle>
        </CardHeader >
        <CardContent className=" items-center justify-center ">
          <form onSubmit={handleSignIn} className="space-y-5">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-customBlue hover:bg-opacity-80">
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <a href="#" className="text-customBlue hover:underline">Forgot your password?</a>
            </p>
          </form>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Image src="icons8-google.svg" alt="Google" width={20} height={20} />
             Continue with Google
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Image src="icons8-linkedin.svg" alt="Google" width={20} height={20} /> Continue with LinkedIn
            </Button>
          </div>
          <p className="text-center text-sm mt-4">
            Don’t have an account? <a href="#" className="text-customBlue hover:underline">Sign up</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
