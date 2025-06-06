import React, { FC, useEffect } from "react";
import { Privilege, PrivilegeFormData } from "../types";
import usePrivilegeApi from "../hooks/usePrivilegesApi";
import { useResources } from "../hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrivilegeSchema } from "../utils/validation";
import { handleApiErrors, mutate } from "@hive/esm-core-api";
import { showNotification } from "@mantine/notifications";
import {
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { InputSkeleton } from "@hive/esm-core-components";

type PriviledgeFormProps = {
  privilege?: Privilege;
  onSuccess?: (privilege: Privilege) => void;
  onCloseWorkspace?: () => void;
};

const PriviledgeForm: FC<PriviledgeFormProps> = ({
  onSuccess,
  privilege,
  onCloseWorkspace,
}) => {
  const { addPrivilege, updatePrivilege } = usePrivilegeApi();
  const { error, isLoading, resources } = useResources();
  const form = useForm<PrivilegeFormData>({
    defaultValues: {
      name: privilege?.name ?? "",
      operations: privilege?.operations ?? [],
      description: privilege?.description ?? "",
      resourceId: privilege?.resourceId ?? "",
      permitedResourceDataPoints: privilege?.permitedResourceDataPoints ?? [],
    },
    resolver: zodResolver(PrivilegeSchema),
  });

  const onSubmit: SubmitHandler<PrivilegeFormData> = async (data) => {
    try {
      const res = privilege
        ? await updatePrivilege(privilege?.id, data)
        : await addPrivilege(data);

      onSuccess?.(res.data);
      onCloseWorkspace?.();

      mutate("/privileges");
      showNotification({
        title: "succes",
        message: `privilege ${privilege ? "updated" : "created"} succesfull`,
        color: "teal",
      });
    } catch (error) {
      const e = handleApiErrors<PrivilegeFormData>(error);
      if (e.detail) {
        showNotification({ title: "error", message: e.detail, color: "error" });
      } else
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof PrivilegeFormData, { message: val })
        );
    }
  };

  const observableSelectedResouseId = form.watch("resourceId");
  const selectedResourseDatapoints =
    resources.find((r) => r.id === observableSelectedResouseId)?.dataPoints ??
    [];

  useEffect(() => {
    form.resetField("permitedResourceDataPoints");
  }, [observableSelectedResouseId]);
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
                placeholder="Enter privilege name"
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
              name="resourceId"
              render={({
                field: { onChange, value, disabled, onBlur, ref },
                fieldState: { error },
              }) => (
                <Select
                  data={resources.map((res) => ({
                    label: res.name,
                    value: res.id,
                  }))}
                  value={value}
                  placeholder="Select resource"
                  onChange={(_value, _) => onChange(_value)}
                  label="Resource"
                  error={error?.message}
                  ref={ref}
                  searchable
                  nothingFoundMessage="Nothing found..."
                  clearable
                />
              )}
            />
          )}
          <Controller
            control={form.control}
            name="permitedResourceDataPoints"
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                {...field}
                data={selectedResourseDatapoints}
                placeholder="Select resource datapoints"
                label="Resource datapoints"
                error={error?.message}
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                clearable
              />
            )}
          />
          <Controller
            control={form.control}
            name="operations"
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                {...field}
                data={["Create", "Read", "Update", "Delete"]}
                placeholder="Select  operations"
                label="Select operations"
                error={error?.message}
                nothingFoundMessage="Nothing found..."
                hidePickedOptions
                clearable
              />
            )}
          />
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

export default PriviledgeForm;
