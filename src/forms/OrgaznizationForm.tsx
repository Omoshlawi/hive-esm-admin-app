import React, { FC } from "react";
import { Organization, OrganizationFormData } from "../types";
import { useMyOrganizationApi } from "../hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationSchema } from "../utils/validation";
import { handleApiErrors, mutate } from "@hive/esm-core-api";
import { showNotification } from "@mantine/notifications";
import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";

type Props = {
  onSuccess?: (organization: Organization) => void;
  organization?: Organization;
  onCloseWorkspace?: () => void;
};

const OrgaznizationForm: FC<Props> = ({
  onSuccess,
  organization,
  onCloseWorkspace,
}) => {
  const { addMyOrganization, updateMyOrganization } = useMyOrganizationApi();
  const form = useForm<OrganizationFormData>({
    defaultValues: {
      name: organization?.name ?? "",
      description: organization?.description,
    },
    resolver: zodResolver(OrganizationSchema),
  });

  const onSubmit: SubmitHandler<OrganizationFormData> = async (data) => {
    try {
      const res = organization
        ? await updateMyOrganization(organization?.id, data)
        : await addMyOrganization(data);

      onSuccess?.(res.data);
      onCloseWorkspace?.();
      mutate("/organization-membership");
      showNotification({
        title: "succes",
        message: `Organization ${
          organization ? "updated" : "created"
        } succesfull`,
        color: "teal",
      });
    } catch (error) {
      const e = handleApiErrors<OrganizationFormData>(error);
      if (e.detail) {
        showNotification({ title: "error", message: e.detail, color: "red" });
      } else
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof OrganizationFormData, { message: val })
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
                placeholder="e.g VStech"
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

export default OrgaznizationForm;
