import { z } from "zod";
import {
  OrganizationMembershipSchema,
  OrganizationSchema,
  PrivilegeSchema,
  ResourceSchema,
  RolePrivilegeSchema,
  RoleSchema,
} from "../utils/validation";

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
export type PrivilegeFormData = z.infer<typeof PrivilegeSchema>;
export type RoleFormData = z.infer<typeof RoleSchema>;
export type RolePrivilegeFormData = z.infer<typeof RolePrivilegeSchema>;
export type ResourceFormData = z.infer<typeof ResourceSchema>;
export type OrganizationMembershipFormData = z.infer<
  typeof OrganizationMembershipSchema
>;
export type UserFormData = {};

export interface Resource {
  id: string;
  name: string;
  description: string;
  dataPoints: string[];
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}

export type Operation = "Create" | "Read" | "Update" | "Delete";
export interface Privilege {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  organizationId: string;
  resourceId: string;
  permitedResourceDataPoints: string[];
  operations: Operation[];
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  resource?: Resource;
  organization?: Organization;
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

export interface RolePrivilege {
  id: string;
  privilegeId: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  privilege: Privilege;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  organization?: Organization;
  privileges?: Array<RolePrivilege>;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  memberUserId: string;
  memberUser: MemberUser;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  organization: Organization;
  membershipRoles: Array<MembershipRole>;
}

export interface MembershipRole {
  id: string;
  membershipId: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  role: Role;
}

export type MemberUser = {
  id: string;
  username: string;
  person: {
    id: string;
    firstName: any;
    lastName: any;
    surname: any;
    phoneNumber: string;
    gender: string;
    email: string;
    name: any;
  };
};

export interface AppService {
  name: string;
  version: string;
  port: number;
  host: string;
  timestamp: number;
  instance: string;
}

export interface ServiceResourcesSchemas {
  schemas: Schemas;
}

export interface Schemas {
  [resource: string]: ResourceSchema;
}

export interface ResourceSchema {
  columnNames: string[];
  orderedColumns: OrderedColumn[];
}

export interface OrderedColumn {
  name: string;
  position: number;
  type: string;
  nullable: boolean;
}
