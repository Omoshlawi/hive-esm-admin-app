import { APIFetchResponse } from "@hive/esm-core-api";
import { AppService } from "../types";
import useSWR from "swr";

const useAppServices = () => {
  const path = "/service-registry/services";
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: AppService[] }>>(path);
  return {
    appServices: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};

export default useAppServices;
