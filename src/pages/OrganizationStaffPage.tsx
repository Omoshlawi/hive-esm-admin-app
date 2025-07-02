import { PiletApi } from "@hive/esm-shell-app";
import React, { useState } from "react";
import { useStaff } from "../hooks";
import { debounceAsync } from "@hive/esm-core-api";
import StaffForm from "../forms/StaffForm";
import { ColumnDef } from "@tanstack/react-table";
import { OrganizationMembership } from "../types";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  DashboardPageHeader,
  DataTable,
  EmptyState,
  ErrorState,
  TablerIcon,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import { openConfirmModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";

type OrganizationStaffPageProps = Pick<PiletApi, "launchWorkspace"> & {};

const OrganizationStaffPage: React.FC<OrganizationStaffPageProps> = ({
  launchWorkspace,
}) => {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });
  const staffsAsync = useStaff(filters);
  const handleSearch = debounceAsync(async (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, 300); // 300ms delay to reduce unnecessary API calls

  const handleAddUpdateStaff = (membership?: OrganizationMembership) => {
    const dispose = launchWorkspace(
      <StaffForm onCloseWorkspace={() => dispose()} membership={membership} />,
      {
        title: "Add Staff",
      }
    );
  };

  const handleDelete = (membership: OrganizationMembership) => {
    openConfirmModal({
      title: "Delete Privilege",
      children: (
        <Text>
          Are you sure you want to delete this privilege.This action is
          destructive and will delete all data privilege
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
    cell({ row }) {
      const membership = row.original;
      return (
        <Group>
          <Group>
            <ActionIcon
              variant="outline"
              aria-label="Settings"
              color="green"
              onClick={() => handleAddUpdateStaff(membership)}
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
              onClick={() => handleDelete(membership)}
            >
              <TablerIcon
                name="trash"
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Group>
      );
    },
  };
  return (
    <Stack>
      <Box>
        <DashboardPageHeader
          title="Staff"
          subTitle={"Organization staffs"}
          icon={"usersGroup"}
        />
      </Box>
      <When
        asyncState={{ ...staffsAsync, data: staffsAsync.staffs }}
        loading={() => <TableSkeleton />}
        error={(e) => <ErrorState error={e} />}
        success={(data) => {
          if (!data.length)
            return <EmptyState onAdd={() => handleAddUpdateStaff()} />;
          return (
            <DataTable
              columns={[...columns, actions]}
              data={data}
              renderActions={() => (
                <>
                  <Button
                    variant="light"
                    leftSection={<IconPlus />}
                    onClick={() => handleAddUpdateStaff()}
                  >
                    Add
                  </Button>
                </>
              )}
              withColumnViewOptions
            />
          );
        }}
      />
    </Stack>
  );
};

export default OrganizationStaffPage;

const columns: ColumnDef<OrganizationMembership>[] = [
  { accessorKey: "memberUser.username", header: "User name" },
  {
    accessorKey: "memberUser.person.firstName",
    header: "First name",
    cell({ getValue }) {
      const value = getValue<string>() || "--";
      return value;
    },
  },
  {
    accessorKey: "memberUser.person.lastName",
    header: "Last name",
    cell({ getValue }) {
      const value = getValue<string>() || "--";
      return value;
    },
  },
  {
    accessorKey: "memberUser.person.surname",
    header: "Surname",
    cell({ getValue }) {
      const value = getValue<string>() || "--";
      return value;
    },
  },
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
    header: "Date Created",
    cell({ getValue }) {
      const created = getValue<string>();
      return new Date(created).toDateString();
    },
  },
];
