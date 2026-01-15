import api from "@/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  relation: string;
  monthlyLimit: number;
  avatarUrl?: string; // Optional if backend returns associated user data
}

export interface InviteMemberRequest {
  name: string;
  email: string;
  role: string;
  relation: string;
  monthlyLimit: number;
}

/**
 * Get all family members
 */
export const getMembers = async (): Promise<Member[]> => {
  const response = await api.get("/members");
  return response.data.data;
};

/**
 * Invite a new member
 */
export const inviteMember = async (
  data: InviteMemberRequest
): Promise<void> => {
  const response = await api.post("/members/invite", data);
  return response.data;
};

/**
 * Remove a member
 */
export const removeMember = async (memberId: string): Promise<void> => {
  await api.delete(`/members/${memberId}`);
};
