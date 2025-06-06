import {
  DataTable,
  EmptyState,
  ErrorState,
  TablerIcon,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import { PiletApi } from "@hive/esm-shell-app";
import { ActionIcon, Button, Group, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import React, { FC } from "react";
import RoleForm from "../forms/RoleForm";
import { useRoles } from "../hooks";
import { Privilege, Role, RolePrivilege } from "../types";
type RolesPageProps = Pick<PiletApi, "launchWorkspace"> & {};

const RolesPage: FC<RolesPageProps> = ({ launchWorkspace }) => {
  const rolesAsync = useRoles();
  const title = "Roles";
  const handleAddOrupdate = (role?: Role) => {
    const dispose = launchWorkspace(
      <RoleForm
        role={role}
        onSuccess={() => dispose()}
        onCloseWorkspace={() => dispose()}
      />,
      {
        title: role ? "Update Role" : "Add Role",
      }
    );
  };
  const handleDelete = (role: Role) => {
    openConfirmModal({
      title: "Delete Privilege",
      children: (
        <Text>
          Are you sure you want to delete this role.This action is destructive
          and will delete all data related to role
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

  const actions: ColumnDef<Role> = {
    id: "actions",
    header: "Actions",
    cell({ row }) {
      const role = row.original;
      return (
        <Group>
          <Group>
            <ActionIcon
              variant="outline"
              aria-label="Settings"
              color="green"
              onClick={() => handleAddOrupdate(role)}
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
              onClick={() => handleDelete(role)}
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
    <When
      asyncState={{ ...rolesAsync, data: rolesAsync.roles }}
      loading={() => <TableSkeleton />}
      error={(e) => <ErrorState error={e} title={title} />}
      success={(data) => {
        if (!data.length)
          return <EmptyState title={title} onAdd={() => handleAddOrupdate()} />;
        return (
          <DataTable
            data={data}
            columns={[...columns, actions]}
            renderActions={() => (
              <>
                <Button
                  variant="light"
                  leftSection={<IconPlus />}
                  onClick={() => handleAddOrupdate()}
                >
                  Add
                </Button>
              </>
            )}
            title="Roles"
            withColumnViewOptions
          />
        );
      }}
    />
  );
};

export default RolesPage;
const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Role",
  },
  {
    accessorKey: "privileges",
    header: "Privileges",
    cell({ getValue }) {
      const privileges = getValue<RolePrivilege[]>();
      return privileges?.map((p) => p.privilege.name).join(", ");
    },
  },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell({ getValue }) {
      const created = getValue<string>();
      return new Date(created).toDateString();
    },
  },
];
