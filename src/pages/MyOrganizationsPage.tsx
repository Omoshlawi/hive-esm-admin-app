import { useSession } from "@hive/esm-core-api";
import {
  DataTable,
  DataTableColumnHeader,
  EmptyState,
  ErrorState,
  TablerIcon,
  TableSkeleton,
  When,
  DashboardPageHeader,
} from "@hive/esm-core-components";
import { PiletApi } from "@hive/esm-shell-app";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Text,
  Stack,
  Box,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import React, { FC } from "react";
import OrgaznizationForm from "../forms/OrgaznizationForm";
import { useMyOrganizations } from "../hooks";
import { Organization, OrganizationMembership } from "../types";

type MyOrganizationsPageProps = Pick<PiletApi, "launchWorkspace"> & {};

const MyOrganizationsPage: FC<MyOrganizationsPageProps> = ({
  launchWorkspace,
}) => {
  const session = useSession();
  const state = useMyOrganizations(session.user?.id);

  const handleAddUpdate = (organization?: Organization) => {
    const dispose = launchWorkspace(
      <OrgaznizationForm
        organization={organization}
        // onSuccess={() => dispose()}
        onCloseWorkspace={() => dispose()}
      />,
      { title: organization ? "Update amenity" : "Register new Oraganization" }
    );
  };

  const handleDelete = (organization: Organization) => {
    openConfirmModal({
      title: "Delete Organization",
      children: (
        <Text>
          Are you sure you want to delete this organization.This action is
          destructive and will delete all data related to organization
        </Text>
      ),
      labels: { confirm: "Delete Organization", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm() {
        // TODO Implement delete
      },
    });
  };
  const actions: ColumnDef<OrganizationMembership> = {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell({ row }) {
      const membership = row.original;
      return (
        <Group>
          <ActionIcon
            variant="outline"
            aria-label="Settings"
            color="green"
            onClick={() => handleAddUpdate(membership.organization)}
          >
            <TablerIcon
              name="edit"
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            variant="outline"
            aria-label="Settings"
            color="red"
            onClick={() => handleDelete(membership.organization)}
          >
            <TablerIcon
              name="trash"
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      );
    },
  };
  return (
    <Stack>
      <Box>
        <DashboardPageHeader
          title="Organization"
          subTitle={"My organizations"}
          icon={"buildings"}
        />
      </Box>
      <When
        asyncState={{ ...state, data: state.organizationsMemberships }}
        loading={() => <TableSkeleton />}
        error={(e) => <ErrorState error={e} />}
        success={(data) => {
          if (!data.length)
            return <EmptyState onAdd={() => handleAddUpdate()} />;
          return (
            <DataTable
              data={data}
              columns={[...columns, actions]}
              withColumnViewOptions
              renderActions={() => (
                <Button
                  onClick={() => handleAddUpdate()}
                  leftSection={<IconPlus />}
                  variant="light"
                >
                  Add
                </Button>
              )}
            />
          );
        }}
      />
    </Stack>
  );
};

export default MyOrganizationsPage;
const columns: ColumnDef<OrganizationMembership>[] = [
  {
    accessorKey: "organization.name",
    header: "Name",
  },
  { accessorKey: "organization.description", header: "Description" },
  {
    accessorKey: "isAdmin",
    header: "MyRole",
    cell({ getValue }) {
      const isAdmin = getValue<boolean>();
      return (
        <Badge color={isAdmin ? "teal" : undefined} size="xs">
          {isAdmin ? "Creator" : "Member"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
    cell({ getValue }) {
      const date = getValue<string>();
      return new Date(date).toDateString();
    },
  },
  {
    accessorKey: "voided",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Active status" />;
    },
    cell({ getValue }) {
      const voided = getValue<boolean>();
      return (
        <Badge color={voided ? "red" : "teal"} size="xs">
          {voided ? "Inactive" : "Active"}
        </Badge>
      );
    },
  },
];
