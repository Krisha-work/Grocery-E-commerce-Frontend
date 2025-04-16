import apiClient from "./apiHelper";

export const processPayment = async (paymentMethodId: string) => {
  return apiClient.post("/cart/payment", { paymentMethodId,  });
}; 