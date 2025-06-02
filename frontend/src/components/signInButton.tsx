'use server'

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
            <Link href="/auth/signup" className="flex items-center gap-2">
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

export default SignInButton;