import { APIFetchResponse } from "@hive/esm-core-api";
import { Resource } from "../types";
import useSWR from "swr";

const useResources = () => {
  const path = "/resources";
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: Resource[] }>>(path);
  return {
    resources: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};

export default useResources;
