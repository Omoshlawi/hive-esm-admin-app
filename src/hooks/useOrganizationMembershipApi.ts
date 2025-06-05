import { apiFetch } from "@hive/esm-core-api";
import {
  OrganizationMembership,
  OrganizationMembershipFormData,
} from "../types";

const addOrganizationMembership = async (
  data: OrganizationMembershipFormData
) => {
  return await apiFetch<OrganizationMembership>("/organization-membership", {
    method: "POST",
    data,
  });
};

const updateOrganizationMembership = async (
  id: string,
  data: OrganizationMembershipFormData,
  method: "PUT" | "PATCH" = "PATCH"
) => {
  return await apiFetch<OrganizationMembership>(
    `/organization-membership/${id}`,
    {
      method: method,
      data,
    }
  );
};

const deleteOrganizationMembership = async (
  id: string,
  method: "DELETE" | "PURGE" = "DELETE"
) => {
  return await apiFetch<OrganizationMembership>(
    `/organization-membership/${id}`,
    {
      method: method,
    }
  );
};

export const useOrganizationMembershipApi = () => {
  return {
    addOrganizationMembership,
    updateOrganizationMembership,
    deleteOrganizationMembership,
  };
};
