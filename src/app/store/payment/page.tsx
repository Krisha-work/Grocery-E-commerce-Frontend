'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PaymentSuccessFormProps {
  transactionId?: string;
  amount?: number;
  email?: string;
  onClose?: () => void;
}

const PaymentSuccessForm: React.FC<PaymentSuccessFormProps> = ({
  transactionId,
  amount,
  email,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <CheckCircle className="w-16 h-16 text-green-500" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
      <p className="text-gray-600 text-center mb-6">
        Thank you for your payment. Your transaction has been completed successfully.
      </p>

      <div className="w-full space-y-3 text-sm">
        {transactionId && (
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">{transactionId}</span>
          </div>
        )}
        {amount && (
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
        )}
        {email && (
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-600">Confirmation sent to:</span>
            <span className="font-medium">{email}</span>
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      )}
    </motion.div>
  );
};

export default PaymentSuccessForm;
