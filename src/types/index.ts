import { z } from "zod";
import { OrganizationSchema } from "../utils/validation";
export interface OrganizationMembership {
  id: string;
  organizationId: string;
  memberUserId: string;
  memberUser: any;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  organization: Organization;
  membershipRoles: any[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}

export type OrganizationFormData = z.infer<typeof OrganizationSchema>;
