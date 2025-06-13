import {
  apiFetch,
  APIFetchResponse,
  constructUrl,
  User,
} from "@hive/esm-core-api";
import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";
import useSWR from "swr";
import { UserFormData } from "../types";

const addUser = async (data: UserFormData) => {
  return await apiFetch<User>("/users", { method: "POST", data });
};

const updateUser = async (
  id: string,
  data: UserFormData,
  method: "PUT" | "PATCH" = "PATCH"
) => {
  return await apiFetch<User>(`/users/${id}`, {
    method: method,
    data,
  });
};

const deleteUser = async (
  id: string,
  method: "DELETE" | "PURGE" = "DELETE"
) => {
  return await apiFetch<User>(`/users/${id}`, {
    method: method,
  });
};

const searchUser = async (search: string) => {
  const url = constructUrl("/users", {
    search,
    v: "custom:include(person)",
  });
  return await apiFetch<{ results: Array<User> }>(url);
};

export const useUserApi = () => {
  return {
    // addUser,
    // updateUser,
    // deleteUser,
    searchUser,
  };
};

export const useSearchUser = () => {
  const [search, setSearch] = useState<string>();
  const [debounced] = useDebouncedValue(search, 500);
  const url = constructUrl("/users", {
    search: debounced,
    v: "custom:include(person)",
  });
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{ results: Array<User> }>
  >(debounced ? url : undefined);
  return {
    users: data?.data?.results ?? [],
    isLoading,
    error,
    searchUser: setSearch,
    searchValue: search,
  };
};
