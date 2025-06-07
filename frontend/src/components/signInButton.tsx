/* eslint-disable @next/next/no-async-client-component */
  /*'use server'
  import { getSession } from "@/lib/session";
  import Link from "next/link";
  import { LogIn, UserPlus, User, LogOut} from "lucide-react";
  import { Button } from "./ui/button";

  const SignInButton = async () => {
    const session = await getSession();

    return (
      <div className="flex items-center gap-2 ml-auto">
        {!session || !session.user ? (
          <>
            <Button variant="outline" asChild>
              <Link href="/auth/signIn" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signUp" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {session.user.firstName}
              </Link>
            <Button variant="outline" asChild>
              <Link href="/api/auth/signout" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  };

  export default SignInButton;*/



  // import { useEffect, useState } from 'react'
  import { deleteSession, getSession } from "@/lib/session"
  import { Session } from '@/lib/session' // Import your Session type
  import Link from "next/link"
  import { LogIn, UserPlus, User, LogOut, LayoutDashboard } from "lucide-react"
  import { Button } from "./ui/button"

  const SignInButton = async () => {
    //const [session, setSession] = useState<Session | null>(null);
    // const [buttonClicked, setButtonClicked]= useState(false);
    const session = await getSession();
  
    // useEffect(() => {
    //   const fetchSession = async () => {
    //     const sessionData = await getSession();
    //     setSession(sessionData);
    //   };
    //   fetchSession();
    //   console.log("refreshing the page :")
    // }, [buttonClicked]);
  
    
  
    return (
      <div className="flex items-center gap-2 ml-auto">
        {!session || !session?.user ? (
          <>
            {/* <Button variant="outline" asChild
            onClick={()=>setButtonClicked(true)}>
              <Link 
                href="/auth/signIn" 
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild
            onClick={()=>setButtonClicked(true)}>
              <Link 
                href="/auth/signUp" 
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </Button> */}
            <Link 
                href="/auth/signIn" 
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link 
                href="/auth/signUp" 
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>

          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              {session.user.role=== "ADMIN" ? (<Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Admin
              </Link>): null}
            <Link href="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {session.user.firstName}
            </Link>
            {/* <Button
              variant="outline"
              onClick={async() => {
                fetch('/api/auth/signout', { method: 'POST' });
                window.location.href = '/';
                
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button> */}
            <a href={"/api/auth/signout"}>Sign Out</a>
          </div>
        )}
      </div>
    );
  };

  export default SignInButton