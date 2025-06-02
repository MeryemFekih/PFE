'use client';

import { getSession } from '@/lib/session';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  FaSun, FaMoon, FaUser,
  FaUniversity, FaRobot, FaCalendarAlt,
  FaPeopleArrows, FaPersonBooth,
  FaTachometerAlt
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';

export default function SidebarWrapper() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu size={24} className="text-blue-950" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:block fixed left-0 top-0 h-full z-30 transition-all duration-300 ${mobileSidebarOpen ? 'translate-x-0' : ''}`}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={`fixed inset-0 z-40 transition-all duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Overlay */}
          {mobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-transparent bg-opacity-30"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar Content */}
          <div className="relative z-50 w-64 h-full bg-white shadow-lg">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <FiX size={24} className="text-blue-950" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState<any>(null);
useEffect(() => {
    const loadSession = async () => {
      const sess = await getSession();
      setSession(sess);
    };
    loadSession();
  }, []);
const menuItems = [
    {
      name: 'Profile',
      icon: <FaUser className="text-lg" />,
      path: '/profile'
    },
    ...(session?.user?.role === 'ADMIN' ? [{
      name: 'Dashboard',
      icon: <FaTachometerAlt  className="text-lg" />, // You'll need to import DashboardIcon
      path: 'admin/dashboard'
    }] : []),
    {
      name: 'Planner',
      icon: <FaCalendarAlt className="text-lg" />,
      path: '/planner'
    },
    {
      name: 'University',
      icon: <FaUniversity className="text-lg" />,
      path: '/university'
    },
    {
      name: 'AI',
      icon: <FaRobot className="text-lg" />,
      path: '/chatbot'
    },
    {
      name: 'Collaborative Space',
      icon: <FaPeopleArrows className="text-lg" />,
      path: '/coworking'
    },
    {
      name: 'Focus Mode',
      icon: <FaPersonBooth className="text-lg" />,
      path: '/soloStuding'
    }
  ];

  const navigate = (path: string) => {
    router.push(path);
    if (onNavigate) onNavigate();
  };

  const isActive = (path: string) => {
    return pathname === path || 
           (path === '/coworking' && pathname.startsWith('/coworking')) ||
           (path === '/solostudying' && pathname.startsWith('/solostudying'));
  };

  return (
    <aside className="w-full h-full bg-blue-950 text-white flex flex-col">
      {/* Logo and Title */}
      <div className='flex items-center pt-6 px-4'>
        <a href="/"><img src="/images/logo.png" alt="BrainWave" className='h-16 w-16 object-contain'/></a>
        <h2 className="text-xl font-bold ml-2">BrainWave</h2>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 overflow-y-auto">
        <ul className="flex flex-col space-y-4 px-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <div
                className={`flex items-center justify-between py-4  pl-4 rounded-lg cursor-pointer transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-900 shadow-md shadow-gray-500 text-white'
                    : 'hover:bg-blue-900 hover:text-white'
                }`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="p-4 flex justify-center">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <FaSun className="text-yellow-300 text-lg" />
          ) : (
            <FaMoon className="text-white text-lg" />
          )}
        </button>
      </div>
    </aside>
  );
}