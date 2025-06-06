import { apiFetch, APIFetchResponse, constructUrl } from "@hive/esm-core-api";
import { ServiceResourcesSchemas } from "../types";
import useSWR from "swr";

export const useAppServicesResourceSchema = (serviceName: string) => {
  const fetcher = async (url: string) => {
    return await apiFetch<ServiceResourcesSchemas>(url, {
      method: "POST",
      data: { name: serviceName },
    });
  };

  const path = constructUrl("/resources-schema", { serviceName: serviceName });
  const { data, error, isLoading, mutate } = useSWR<
    APIFetchResponse<ServiceResourcesSchemas>
  >(path, fetcher, { refreshInterval: 1000 });
  return {
    resourceSchemas: data?.data,
    isLoading,
    error,
    mutate,
  };
};

const sourceServiceResourcesSchema = async (serviceName: string) => {
  return await apiFetch<ServiceResourcesSchemas>("/resources-schema/source", {
    method: "POST",
    data: { name: serviceName },
  });
};

export const useAppServicesResourceSchemaApi = () => {
  return { sourceServiceResourcesSchema };
};
