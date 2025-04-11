// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// const mainNavItems = [
//   { label: 'Home', href: '/' },
//   { label: 'Shop', href: '/shop' },
//   { label: 'Products', href: '/store/products' },
//   { label: 'Login', href: '/auth/login' },
//   { label: 'Register', href: '/auth/register' },
// ];

// export default function MainNav() {
//   const pathname = usePathname();

//   return (
//     <nav className="hidden md:flex items-center space-x-6">
//       {mainNavItems.map((item) => (
//         <Link
//           key={item.href}
//           href={item.href}
//           className={`text-sm font-medium transition-colors hover:text-[#1B4B27] ${
//             pathname === item.href
//               ? 'text-[#1B4B27]'
//               : 'text-gray-600'
//           }`}
//         >
//           {item.label}
//         </Link>
//       ))}
//     </nav>
//   );
// } 