'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SpinnerOverlay() {
  const pathname = usePathname(); // Track route changes
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Show spinner on route change

    const timer = setTimeout(() => {
      setIsLoading(false); // Hide spinner after delay
    }, 500); // You can reduce this delay if needed

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run on each route change

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0  bg-white z-[9999] flex items-center justify-center">
      <img
        src="/images/logo.png"
        alt="Loading"
        className="w-30 h-30 bg-blue-800 rounded-full p-4 animate-spin"
      />
    </div>
  );
}
