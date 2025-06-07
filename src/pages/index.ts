import { withUserAccess } from "@hive/esm-core-components";
import AppServicesPage from "./AppServicesPage";
import MyOrganizationsPage from "./MyOrganizationsPage";
import OrganizationStaffPage from "./OrganizationStaffPage";
import PrivilegesPage from "./PrivilegesPage";
import ResourcesPage from "./ResourcesPage";
import RolesPage from "./RolesPage";

export const Appservices = withUserAccess(AppServicesPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
export const MyOrganizations = withUserAccess(MyOrganizationsPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
export const OrganizationStaff = withUserAccess(OrganizationStaffPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
export const Privileges = withUserAccess(PrivilegesPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
export const Resources = withUserAccess(ResourcesPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
export const Roles = withUserAccess(RolesPage, {
  isAuthenticated: (session) => session.isAuthenticated,
  requiresAuth: true,
});
