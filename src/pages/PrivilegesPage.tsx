import React, { FC, useMemo } from "react";
import { usePrivileges } from "../hooks";
import type { PiletApi } from "@hive/esm-shell-app";
import PriviledgeForm from "../forms/PriviledgeForm";
import { Privilege } from "../types";
import { openConfirmModal } from "@mantine/modals";
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Menu,
  Paper,
  Table,
  TableData,
  Text,
} from "@mantine/core";
import {
  DataTable,
  EmptyState,
  ErrorState,
  TablerIcon,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import { IconPlus } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
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

  const actions: ColumnDef<Privilege> = {
    id: "actions",
    header: "Actions",
    cell({ row }) {
      const privilege = row.original;
      return (
        <Group>
          <Group>
            <ActionIcon
              variant="outline"
              aria-label="Settings"
              color="green"
              onClick={() => handleAddOrupdate(privilege)}
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
              onClick={() => handleDelete(privilege)}
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
      asyncState={{ ...privilegesAsync, data: privilegesAsync.privileges }}
      loading={() => <TableSkeleton />}
      error={(e) => <ErrorState error={e} title={title} />}
      success={(data) => {
        if (!data.length)
          return <EmptyState title={title} onAdd={() => handleAddOrupdate()} />;
        return (
          <DataTable
            columns={[...columns, actions]}
            data={data}
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
            title="Privileges"
            withColumnViewOptions
          />
        );
      }}
    />
  );
};

export default PrivilegesPage;
const columns: ColumnDef<Privilege>[] = [
  { accessorKey: "name", header: "Privilege" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "resource.name", header: "Resource" },
  {
    accessorKey: "permitedResourceDataPoints",
    header: "Data points",
    cell({ getValue }) {
      const points = getValue<Array<string>>();
      return points.join(", ");
    },
  },
  {
    accessorKey: "operations",
    header: "Operations",
    cell({ getValue }) {
      const operation = getValue<Array<string>>();
      return operation.join(", ");
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
