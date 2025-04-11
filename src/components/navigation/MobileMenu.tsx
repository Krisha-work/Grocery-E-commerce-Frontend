// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// const mobileMenuItems = [
//   { label: 'Home', href: '/' },
//   { label: 'Shop', href: '/shop' },
//   { label: 'Products', href: '/store/products' },
//   { label: 'Login', href: '/auth/login' },
//   { label: 'Register', href: '/auth/register' },
// ];

// export default function MobileMenu() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   return (
//     <div className="md:hidden">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="text-gray-600 hover:text-[#1B4B27] text-black focus:outline-none"
//         aria-label="Toggle mobile menu"
//       >
//         <svg
//           className="h-6 w-6 text-black "
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           {isOpen ? (
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           ) : (
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           )}
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute left-0 right-0 top-16 z-50 bg-white t-black p-4 shadow-lg">
//           <nav className="space-y-4">
//             {mobileMenuItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`block text-sm font-medium transition-colors hover:text-[#1B4B27] ${
//                   pathname === item.href
//                     ? 'text-[#1B4B27]'
//                     : 'text-gray-600'
//                 }`}
//                 onClick={() => setIsOpen(false)}
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       )}
//     </div>
//   );
// } 