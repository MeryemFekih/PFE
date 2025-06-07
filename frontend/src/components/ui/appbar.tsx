'use client';

import { getSession } from '@/lib/session';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  FaUser, FaUniversity, FaRobot, FaCalendarAlt,
  FaPeopleArrows, FaPersonBooth, FaTachometerAlt
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
      {isMobile && (
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-100"
        >
          <FiMenu size={24} className="text-blue-950" />
        </button>
      )}

      {!isMobile && (
        <aside className="w-64 h-screen bg-blue-950 text-white fixed left-0 top-0">
          <Sidebar />
        </aside>
      )}

      {isMobile && mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 h-full bg-blue-950 text-white shadow-lg relative z-50">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={24} className="text-white" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black opacity-50"
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

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    if (onNavigate) onNavigate();
  };

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path);

  const menuItems = [
    { name: 'Profile', icon: <FaUser />, path: '/profile' },
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard', show: session?.user?.role !== 'PUBLIC' },
    { name: 'Admin', icon: <FaTachometerAlt />, path: '/admin/dashboard', show: session?.user?.role === 'ADMIN' },
    { name: 'Planner', icon: <FaCalendarAlt />, path: '/planner' },
    { name: 'University', icon: <FaUniversity />, path: '/university' },
    { name: 'AI', icon: <FaRobot />, path: '/chatbot' },
    { name: 'Collaborative Space', icon: <FaPeopleArrows />, path: '/coworking' },
    { name: 'Focus Mode', icon: <FaPersonBooth />, path: '/soloStuding' }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 text-2xl font-bold">BrainWave</div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.filter(item => item.show !== false).map(item => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${isActive(item.path) ? 'bg-blue-900' : 'hover:bg-blue-800'}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
