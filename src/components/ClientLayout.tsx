'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar/page';
import Footer from './Footer/page';
import LayoutEffectSuppressor from './LayoutEffectSuppressor';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent flash of unstyled content and hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <LayoutEffectSuppressor />
      <Navbar />
      <div className='bg-white-100 w-100%'>
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
} 