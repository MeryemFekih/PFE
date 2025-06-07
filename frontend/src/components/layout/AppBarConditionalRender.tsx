'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../ui/sideBar';

interface AppBarConditionalRenderProps {
  children: React.ReactNode;
  session: any;
}

const layoutWithSidebarPaths = [
  '/dashboard',
  '/planner',
  '/university',
  '/chatbot',
  '/profile',
  '/admin/dashboard'
];

export default function AppBarConditionalRender({
  children,
  session
}: AppBarConditionalRenderProps) {
  const pathname = usePathname();
  const showSidebar = session && layoutWithSidebarPaths.some((path) =>
    pathname?.startsWith(path)
  );

  if (!showSidebar) {
    return <>{children}</>; // No sidebar
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-52 ">{children}</main>
    </div>
  );
}
