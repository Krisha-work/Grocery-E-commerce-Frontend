// 'use client';

// import React from 'react';

// interface CartSummaryProps {
//   subtotal: number;
//   shipping: number;
//   tax: number;
// }

// export default function CartSummary({ subtotal, shipping, tax }: CartSummaryProps) {
//   const total = subtotal + shipping + tax;

//   return (
//     <div className="rounded-lg border border-gray-200 bg-white p-6">
//       <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
//       <div className="mt-4 space-y-4">
//         <div className="flex justify-between text-sm">
//           <span>Subtotal</span>
//           <span>${subtotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span>Shipping</span>
//           <span>${shipping.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span>Tax</span>
//           <span>${tax.toFixed(2)}</span>
//         </div>
//         <div className="border-t border-gray-200 pt-4">
//           <div className="flex justify-between font-semibold">
//             <span>Total</span>
//             <span>${total.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//       <button
//         className="mt-6 w-full rounded-md bg-[#1B4B27] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#143d1f] focus:outline-none focus:ring-2 focus:ring-[#1B4B27] focus:ring-offset-2"
//       >
//         Proceed to Checkout
//       </button>
//     </div>
//   );
// } 