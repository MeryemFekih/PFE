'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import {
  FaSun, FaMoon, FaUser,
  FaUniversity, FaRobot, FaCalendarAlt,
  FaPeopleArrows, FaPersonBooth, FaTachometerAlt
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';

export default function SidebarWrapper() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
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
      <div className="hidden md:block fixed left-0 top-0 h-full z-30 w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isMobile && mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 h-full bg-white shadow-lg relative z-50">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <FiX size={24} className="text-blue-950" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black opacity-30"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    if (onNavigate) onNavigate();
  };

  const isActive = (path: string) => pathname?.startsWith(path);

  const menuItems = [
    { name: 'Profile', icon: <FaUser className="text-lg" />, path: '/profile' },
    ...(session?.user?.role === 'ADMIN'
      ? [{
          name: 'Dashboard',
          icon: <FaTachometerAlt className="text-lg" />,
          path: '/admin/dashboard'
        }]
      : []),
    { name: 'Planner', icon: <FaCalendarAlt className="text-lg" />, path: '/planner' },
    { name: 'University', icon: <FaUniversity className="text-lg" />, path: '/university' },
    { name: 'AI', icon: <FaRobot className="text-lg" />, path: '/chatbot' },
    { name: 'Collaborative Space', icon: <FaPeopleArrows className="text-lg" />, path: '/coworking' },
    { name: 'Focus Mode', icon: <FaPersonBooth className="text-lg" />, path: '/soloStuding' }
  ];

  return (
    <aside className="w-max h-full bg-blue-950 text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center pt-6 px-4">
        <Link href="/">
          <img src="/images/logo.png" alt="BrainWave" className="h-16 w-16 object-contain" />
        </Link>
        <h2 className="text-xl font-bold ml-2">BrainWave</h2>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 overflow-y-auto">
        <ul className="flex flex-col space-y-4 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <div
                className={`flex items-center justify-between py-4 pl-4 rounded-lg cursor-pointer transition-all ${
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
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
