import { APIFetchResponse, constructUrl } from "@hive/esm-core-api";
import { Role } from "../types";
import useSWR from "swr";

const useRoles = () => {
  const path = constructUrl("/roles", {
    v: "custom:include(privileges:include(privilege))",
  });
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: Role[] }>>(path);
  return {
    roles: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};

export default useRoles;
