export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

/**
 * Payment request parameters for processing a cart payment
 */
export interface PaymentRequest {
  /** Stripe payment method ID */
  paymentMethodId: string;
  /** Customer ID in the system */
  customerId: number;
}

/**
 * Payment response from the payment processing
 */
export interface PaymentResponse {
  /** Whether the payment was successful */
  success: boolean;
  /** Transaction ID from Stripe */
  transactionId?: string;
  /** Error message if payment failed */
  error?: string;
}