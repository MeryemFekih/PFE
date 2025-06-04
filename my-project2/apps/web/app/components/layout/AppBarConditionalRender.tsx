// app/components/layout/AppBarConditionalRender.tsx
'use client'; // This is crucial! Marks it as a Client Component

import { usePathname } from 'next/navigation'; // Import usePathname
import AppBar from '../ui/appbar'; // Adjust path if necessary

interface AppBarConditionalRenderProps {
  session: any; // Use a more specific type for your session if possible
}

export default function AppBarConditionalRender({ session }: AppBarConditionalRenderProps) {
  const pathname = usePathname(); // Get the current pathname from the client-side router

  // Define paths where the AppBar should NOT be shown
  // Ensure this matches your actual route, e.g., '/soloStuding'
  const noAppBarPaths = ['/soloStuding']; // Note: 'soloStuding' had a typo, fixed to 'soloStudying' if that's what you meant in your sidebar, otherwise keep it.

  // Your conditional logic
  const showAppBar = session && !noAppBarPaths.includes(pathname);

  // console.log('Client-side Pathname:', pathname);
  // console.log('Client-side showAppBar:', showAppBar);

  if (!showAppBar) {
    return null; // Don't render the AppBar if not shown
  }

  // **IMPORTANT CHANGE:** Remove the div wrapper. AppBar itself is fixed.
  return (
    <AppBar />
  );
}