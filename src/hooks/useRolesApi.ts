import { apiFetch } from "@hive/esm-core-api";
import { Role, RoleFormData } from "../types";

const addRole = async (data: RoleFormData) => {
  return await apiFetch<Role>("/roles", { method: "POST", data });
};

const updateRole = async (
  id: string,
  data: RoleFormData,
  method: "PUT" | "PATCH" = "PATCH"
) => {
  return await apiFetch<Role>(`/roles/${id}`, {
    method: method,
    data,
  });
};

const deleteRole = async (
  id: string,
  method: "DELETE" | "PURGE" = "DELETE"
) => {
  return await apiFetch<Role>(`/roles/${id}`, {
    method: method,
  });
};
const useRoleApi = () => {
  return {
    addRole,
    updateRole,
    deleteRole,
  };
};

export default useRoleApi;
