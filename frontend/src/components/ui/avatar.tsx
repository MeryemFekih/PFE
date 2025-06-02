import * as React from 'react';

export function Avatar({ children }: { children: React.ReactNode }) {
  return <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">{children}</div>;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-gray-700">{children}</span>;
}
