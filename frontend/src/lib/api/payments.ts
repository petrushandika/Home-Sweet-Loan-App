import api from "@/lib/api";
import { getAuthToken } from "./setup";

export interface PaymentResponse {
  token: string;
  redirect_url: string;
  orderId: string;
}

export const initiatePayment = async (
  plan: string,
  amount: number
): Promise<PaymentResponse> => {
  const response = await api.post(
    "/payments",
    { plan, amount },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );

  // The backend controller return format might be wrapped in `data` or direct?
  // PaymentsController.initiatePayment returns the result of service.createTransaction.
  // NestJS Interceptor usually wraps in { statusCode, message, data }.
  // I should check if api.post returns response.data or response.
  // Typically axios returns response object. response.data is the body.
  // If backend uses generic response interceptor, actual data is in response.data.data.

  // Checking SetupController or others for consistency.
  // In `setup.ts`: return response.data.data;

  return response.data.data || response.data;
};

export const checkPaymentStatus = async (orderId: string) => {
  const response = await api.post(
    "/payments/check-status",
    { orderId },
    {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }
  );
  return response.data.data || response.data;
};
