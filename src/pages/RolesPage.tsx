import {
  EmptyState,
  ErrorState,
  TableContainer,
  TablerIcon,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import { PiletApi } from "@hive/esm-shell-app";
import {
  ActionIcon,
  Button,
  Menu,
  Table,
  TableData,
  Text,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import React, { FC, useMemo } from "react";
import RoleForm from "../forms/RoleForm";
import { useRoles } from "../hooks";
import { Role } from "../types";
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

  const tableData = useMemo<TableData>(
    () => ({
      head: ["#", "Name", "Description", "CreatedAt", "Actions"],
      body: rolesAsync?.roles.map((docType, i) => [
        i + 1,
        docType.name,
        docType.description,
        // docType.privileges?.name ?? "--",
        new Date(docType.createdAt).toDateString(),
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="outline" aria-label="Settings">
              <TablerIcon
                name="dotsVertical"
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<TablerIcon name="edit" size={14} />}
              color="green"
              onClick={() => handleAddOrupdate(docType)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="trash" size={14} />}
              color="red"
              onClick={() => handleDelete(docType)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>,
      ]),
    }),
    [rolesAsync.roles]
  );

  return (
    <When
      asyncState={{ ...rolesAsync, data: rolesAsync.roles }}
      loading={() => <TableSkeleton />}
      error={(e) => <ErrorState error={e} headerTitle={title} />}
      success={(data) => {
        if (!data.length)
          return (
            <EmptyState headerTitle={title} onAdd={() => handleAddOrupdate()} />
          );
        return (
          <TableContainer
            title={title}
            actions={
              <Button
                variant="subtle"
                leftSection={<IconPlus />}
                onClick={() => handleAddOrupdate()}
              >
                Add
              </Button>
            }
          >
            <Table
              striped
              data={tableData}
              highlightOnHover
              styles={{
                td: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </TableContainer>
        );
      }}
    />
  );
};

export default RolesPage;
