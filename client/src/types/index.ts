export type MemberRole = "Admin" | "Member" | "Owner";
export type MemberStatus = "active" | "inactive";
export type InvitationStatus = "Pending" | "Accepted" | "Rejected";

export type MemberType = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  createdAt: string;
  userId: string;
};

export type InvitationType = {
  id: string;
  inviteeEmail: string;
  role: MemberRole;
  status: InvitationStatus;
  inviterName: string;
  createdAt: string;
  expiresAt: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  organizationId?: string | null;
};

export type SessionType = {
  id: string;
  expiresAt: string;
  createdAt: string;
  browserName: string;
  osName: string;
};

export type OrganizationType = {
  id: string;
  name: string;
};
