import { OrganizationMembership } from "../types";
import { APIFetchResponse, constructUrl } from "@hive/esm-core-api";
import useSWR from "swr";
const useMyOrganizations = (memberUserId: string) => {
  const customRep = "custom:include(organization,membershipRoles)";
  const path = constructUrl("/organization-membership", {
    v: customRep,
    memberUserId,
  });
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: OrganizationMembership[] }>>(path);
  return {
    organizationsMemberships: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};

export default useMyOrganizations;
