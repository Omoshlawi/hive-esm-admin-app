import { handleApiErrors, mutate } from "@hive/esm-core-api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  useOrganizationMembershipApi,
  useRoles,
  useSearchUser,
} from "../hooks";
import {
  OrganizationMembership,
  OrganizationMembershipFormData,
} from "../types";
import { OrganizationMembershipSchema } from "../utils/validation";
import { InputSkeleton } from "@hive/esm-core-components";

type StaffFormProps = {
  membership?: OrganizationMembership;
  onSuccess?: (membership: OrganizationMembership) => void;
  onCloseWorkspace?: () => void;
};
const StaffForm: React.FC<StaffFormProps> = ({
  membership,
  onCloseWorkspace,
  onSuccess,
}) => {
  const { addOrganizationMembership, updateOrganizationMembership } =
    useOrganizationMembershipApi();
  const {
    searchUser,
    isLoading: isUsersloading,
    error: userError,
    users,
    searchValue,
  } = useSearchUser();
  const { error: rolesError, isLoading, roles } = useRoles();
  const form = useForm<OrganizationMembershipFormData>({
    defaultValues: {
      memberUserId: membership?.memberUserId ?? "",
      roleIds: membership?.membershipRoles?.map((role) => role.roleId) ?? [],
    },
    resolver: zodResolver(OrganizationMembershipSchema),
  });

  const onSubmit: SubmitHandler<OrganizationMembershipFormData> = async (
    data
  ) => {
    try {
      const res = membership
        ? await updateOrganizationMembership(membership?.id, data)
        : await addOrganizationMembership(data);

      onSuccess?.(res.data);
      onCloseWorkspace?.();
      mutate("/organization-membership");
      showNotification({
        title: "succes",
        message: `membership ${membership ? "updated" : "created"} succesfull`,
        color: "teal",
      });
    } catch (error) {
      const e = handleApiErrors<OrganizationMembershipFormData>(error);
      if (e.detail) {
        showNotification({ title: "error", message: e.detail, color: "red" });
      } else {
        Object.entries(e).forEach(([key, val]) => {
          if (OrganizationMembershipSchema.keyof().options.includes(key as any))
            form.setError(key as keyof OrganizationMembershipFormData, {
              message: val,
            });
          else {
            showNotification({ title: key, message: val, color: "red" });
          }
        });
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack p={"md"} h={"100%"} justify="space-between">
        <Stack gap={"md"}>
          <Controller
            control={form.control}
            name="memberUserId"
            render={({ field, fieldState: { error } }) => (
              <>
                {!!!membership ? (
                  <Select
                    {...field}
                    searchable
                    data={users.map((u) => ({
                      label: u.username,
                      value: u.id,
                    }))}
                    searchValue={searchValue}
                    onSearchChange={searchUser}
                    placeholder="search user"
                    onChange={(_value, _) => field.onChange(_value)}
                    label="User"
                    error={error?.message}
                    nothingFoundMessage="Nothing found..."
                    clearable
                  />
                ) : (
                  <TextInput
                    {...field}
                    label="User"
                    error={error?.message}
                    placeholder="Enter role name"
                    disabled
                  />
                )}
              </>
            )}
          />

          {isLoading ? (
            <InputSkeleton />
          ) : (
            <Controller
              control={form.control}
              name="roleIds"
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  {...field}
                  data={roles.map((pr) => ({
                    label: pr.name,
                    value: pr.id,
                  }))}
                  placeholder="Select Roles"
                  limit={10}
                  label="Roles"
                  searchable
                  error={error?.message}
                  nothingFoundMessage="Nothing found..."
                  hidePickedOptions
                  clearable
                />
              )}
            />
          )}
        </Stack>
        <Group gap={1}>
          <Button
            flex={1}
            variant="default"
            radius={0}
            onClick={onCloseWorkspace}
          >
            Cancel
          </Button>
          <Button
            radius={0}
            flex={1}
            fullWidth
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default StaffForm;
