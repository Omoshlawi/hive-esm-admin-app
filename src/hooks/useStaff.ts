import { APIFetchResponse, constructUrl, useSession } from "@hive/esm-core-api";
import { OrganizationMembership } from "../types";
import useSWR from "swr";

export const useStaff = (filters: Record<string, any>) => {
  const session = useSession();
  const path = constructUrl("/organization-membership", {
    v: "custom:include(organization,membershipRoles)",
    context: "organization",
    ...filters,
    organizationContext: session.currentOrganization,
  });
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: OrganizationMembership[] }>>(path);
  return {
    staffs: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};
