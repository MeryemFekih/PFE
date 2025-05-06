
  import { getSession } from "@/lib/session"
  import Link from "next/link"
  import { LogIn, UserPlus, User, LogOut, LayoutDashboard } from "lucide-react"

  const SignInButton = async () => {
    const session = await getSession();
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
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              {session.user.firstName}
            </Link>
           <a className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center" href={"/api/auth/signout"}>
           <LogOut className="h-4 w-4 mr-2"/>
           Sign Out
           </a>
          
              
          </div>
        )}
      </div>
    );
  };

  export default SignInButton