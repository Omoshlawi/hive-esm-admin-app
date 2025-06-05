import React, { FC } from "react";
import { Role, RoleFormData } from "../types";
import { usePrivileges, useRolesApi } from "../hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleSchema } from "../utils/validation";
import { handleApiErrors, mutate } from "@hive/esm-core-api";
import { showNotification } from "@mantine/notifications";
import {
  Button,
  Group,
  MultiSelect,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { InputSkeleton } from "@hive/esm-core-components";

type RoleFormProps = {
  role?: Role;
  onSuccess?: (role: Role) => void;
  onCloseWorkspace?: () => void;
};

const RoleForm: FC<RoleFormProps> = ({ onCloseWorkspace, onSuccess, role }) => {
  const { addRole, updateRole } = useRolesApi();
  const { error, isLoading, privileges } = usePrivileges();
  const form = useForm<RoleFormData>({
    defaultValues: {
      name: role?.name ?? "",
      description: role?.description ?? "",
      privileges: role?.privileges?.map(({ privilege: { id } }) => id) ?? [],
    },
    resolver: zodResolver(RoleSchema),
  });

  const onSubmit: SubmitHandler<RoleFormData> = async (data) => {
    try {
      const res = role ? await updateRole(role?.id, data) : await addRole(data);
      onSuccess?.(res.data);
      mutate("/roles");
      showNotification({
        title: "succes",
        message: `role ${role ? "updated" : "created"} succesfull`,
        color: "teal",
      });
    } catch (error) {
      const e = handleApiErrors<RoleFormData>(error);
      if (e.detail) {
        showNotification({ title: "error", message: e.detail, color: "red" });
      } else
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof RoleFormData, { message: val })
        );
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
            name="name"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Name"
                error={fieldState.error?.message}
                placeholder="Enter role name"
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value as string}
                placeholder="Description ..."
                label="Description"
                error={fieldState.error?.message}
              />
            )}
          />

          {isLoading ? (
            <InputSkeleton />
          ) : (
            <Controller
              control={form.control}
              name="privileges"
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  {...field}
                  data={privileges.map((pr) => ({
                    label: pr.name,
                    value: pr.id,
                  }))}
                  placeholder="Select privileges"
                  limit={10}
                  label="Privileges"
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

export default RoleForm;
