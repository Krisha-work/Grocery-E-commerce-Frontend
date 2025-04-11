"use client";
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar/page';
import './globals.css';
import LayoutEffectSuppressor from '../components/LayoutEffectSuppressor';
import Sidebar from '../components/Sidebar/Page';
import Footer from '../components/Footer/page';
// import Footer from '/components/footer/page';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Suppresses useLayoutEffect warnings during SSR */}
        <LayoutEffectSuppressor />


        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className='bg-white-100 w-100%'>

            <main>{children}</main>
        </div>
        
        {/* Footer */}
        <Footer />

      </body>
    </html>
  );
}
