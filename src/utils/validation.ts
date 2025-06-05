import { z } from "zod";

export const OrganizationSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
});

export const PrivilegeSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  resourceId: z.string().uuid("invalid resource"),
  permitedResourceDataPoints: z.array(z.string().min(1, "required")),
  operations: z.array(z.enum(["Create", "Read", "Update", "Delete"])),
});

export const ResourceSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  dataPoints: z.array(z.string().min(1, "required")),
});

export const RolePrivilegeSchema = z.object({
  roleId: z.string().uuid("invalid role"),
  privilegeId: z.string().uuid("invalid privilege"),
});

export const RoleSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  privileges: z.array(z.string().uuid()),
});

export const OrganizationMembershipSchema = z.object({
  memberUserId: z.string().uuid("invalid user"),
  roleIds: z.array(z.string().uuid("invalid role")),
});
