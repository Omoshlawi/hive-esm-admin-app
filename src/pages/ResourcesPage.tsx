import React, { useMemo } from "react";
import { useResources } from "../hooks";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Paper,
  Stack,
  Table,
  TableData,
  Title,
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
import { Resource } from "../types";

const ResourcesPage = () => {
  const resoucesAsync = useResources();
  const title = "Resources";

  const tableData = useMemo<TableData>(
    () => ({
      head: ["#", "Name", "Description", "CreatedAt", "Actions"],
      body: resoucesAsync?.resources?.map((docType, i) => [
        i + 1,
        docType.name,
        docType.description,
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
              onClick={() => {}}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="trash" size={14} />}
              color="red"
              onClick={() => {}}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>,
      ]),
    }),
    [resoucesAsync.resources]
  );

  return (
    <When
      asyncState={{ ...resoucesAsync, data: resoucesAsync.resources }}
      loading={() => <TableSkeleton />}
      error={(e) => <ErrorState error={e} title={title} />}
      success={(data) => {
        if (!data.length)
          return <EmptyState title={title} message="No resources" />;
        return (
          <DataTable
            columns={columns}
            data={data}
            title="Resources"
            withColumnViewOptions
          />
        );
      }}
    />
  );
};

export default ResourcesPage;
const columns: ColumnDef<Resource>[] = [
  { accessorKey: "name", header: "Resource" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "dataPoints",
    header: "Data Points",
    cell({ getValue }) {
      const dataPoints = getValue<string[]>();
      return dataPoints.join(", ");
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
