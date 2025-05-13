import { getSession } from "@/lib/session"
import Link from "next/link"
import { LogIn, UserPlus, User, LogOut, LayoutDashboard } from "lucide-react"

const SignInButton = async () => {
  const session = await getSession();

  return (
    <div className="flex items-center gap-2 ml-auto">
      {!session || !session?.user ? (
        <>
          <Link 
            href="/auth/signIn" 
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Link>
          <Link 
            href="/auth/signUp" 
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Link>
        </>
      ) : (
        <div className="flex items-center gap-4">
          {/* Show user dashboard only when approved */}
          {session.user.role !== 'PUBLIC' && (
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          )}

          {/* Admin dashboard link */}
          {session.user.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Admin
            </Link>
          )}
          <Link
              href="/university"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              ESSTHS  
            </Link>
            <Link
              href="/soloStuding"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Solo Studying  
            </Link>

          <Link href="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
            <User className="h-4 w-4 mr-2" />
            {session.user.firstName}
          </Link>

          <a
            href="/api/auth/signout"
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </a>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
