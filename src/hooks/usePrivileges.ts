import { APIFetchResponse, constructUrl, useSession } from "@hive/esm-core-api";
import { Privilege } from "../types";
import useSWR from "swr";

const usePrivileges = () => {
  const session = useSession();
  // const customeRep = "custom:include(privileges)";
  const path = constructUrl("/privileges", {
    v: undefined,
    organization: session.currentOrganization,
  });
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: Privilege[] }>>(path);
  return {
    privileges: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};

export default usePrivileges;
