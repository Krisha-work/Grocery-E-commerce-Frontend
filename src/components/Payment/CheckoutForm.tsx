import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment } from '../../lib/api/payments';

interface CheckoutFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (methodError || !paymentMethod) {
      setError(methodError?.message || 'Payment method creation failed');
      setLoading(false);
      return;
    }

    try {
      const response = await processPayment(paymentMethod.id);

      console.log(response,"-----------");
      
      const { clientSecret, status } = response.data;

      if (status === 'requires_action') {
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

        if (confirmError) {
          setError(confirmError.message || 'Authentication failed');
        } else if (paymentIntent?.status === 'succeeded') {
          setMessage('Payment successful!');
          onSuccess?.();
          window.location.href = '/store/payment';
          setTimeout(() => setIsOpen(false), 2000);
        }
      } else if (status === 'succeeded') {
        setMessage('Payment successful!');
        window.location.href = '/store/payment';
        onSuccess?.();
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setMessage(`Payment status: ${status}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    }

    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
      >
        Payment
      </button>

      {isOpen && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border rounded-md p-3">
                <CardElement options={{ hidePostalCode: true }} />
              </div>
              <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full btn btn-primary"
              >
                {loading ? 'Processing…' : 'Pay Now'}
              </button>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {message && <div className="text-green-600 text-sm">{message}</div>}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
