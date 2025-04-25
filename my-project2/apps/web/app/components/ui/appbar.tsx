import { Brain, Home, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import SignInButton from '../signInButton';

const AppBar = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo - Far left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="Home">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:inline">
                BrainWave
              </span>
            </Link>
          </div>

          {/* Navigation and Auth Buttons - Far right */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Admin
              </Link>
              
            </nav>

            {/* Auth Buttons */}
            <div className="flex-shrink-0">
              <SignInButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar;