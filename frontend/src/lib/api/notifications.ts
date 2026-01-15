import api from "@/lib/api";
import { getAuthToken } from "./setup";

export interface Notification {
  id: string;
  userId: string;
  type:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR"
    | "PAYMENT"
    | "SYSTEM"
    | "BUDGET"
    | "ASSET";
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  link: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get("/notifications", {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    // Backend returns { success: true, message: "...", data: [...] }
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
};

export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await api.patch(
    `/notifications/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );
  return response.data;
};

export const markAllAsRead = async (): Promise<void> => {
  await api.patch(
    "/notifications/read-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );
};
