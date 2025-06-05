import React, { FC, useMemo } from "react";
import { usePrivileges } from "../hooks";
import type { PiletApi } from "@hive/esm-shell-app";
import PriviledgeForm from "../forms/PriviledgeForm";
import { Privilege } from "../types";
import { openConfirmModal } from "@mantine/modals";
import {
  ActionIcon,
  Button,
  Loader,
  Menu,
  Table,
  TableData,
  Text,
} from "@mantine/core";
import {
  EmptyState,
  ErrorState,
  TableContainer,
  TablerIcon,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import { IconPlus } from "@tabler/icons-react";
type PrivilegesPageProps = Pick<PiletApi, "launchWorkspace"> & {};

const PrivilegesPage: FC<PrivilegesPageProps> = ({ launchWorkspace }) => {
  const privilegesAsync = usePrivileges();
  const title = "Privileges";
  const handleAddOrupdate = (privilege?: Privilege) => {
    const dispose = launchWorkspace(
      <PriviledgeForm
        privilege={privilege}
        onSuccess={() => dispose()}
        onCloseWorkspace={() => dispose()}
      />,
      {
        title: privilege ? "Update Privilege" : "Add Privilege",
      }
    );
  };

  const handleDelete = (privilege: Privilege) => {
    openConfirmModal({
      title: "Delete Privilege",
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

  const tableData = useMemo<TableData>(
    () => ({
      head: ["#", "Name", "Description", "Resource", "CreatedAt", "Actions"],
      body: privilegesAsync?.privileges.map((docType, i) => [
        i + 1,
        docType.name,
        docType.description,
        docType.resource?.name ?? "--",
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
    [privilegesAsync.privileges]
  );

  return (
    <When
      asyncState={{ ...privilegesAsync, data: privilegesAsync.privileges }}
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

export default PrivilegesPage;
