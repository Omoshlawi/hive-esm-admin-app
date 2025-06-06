import {
    DataTable,
    DataTableColumnHeader,
    EmptyState,
    ErrorState,
    TablerIcon,
    TableSkeleton,
    When,
} from "@hive/esm-core-components";
import {
    ActionIcon,
    Chip,
    Menu
} from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import AppServiceResourcesExpandedRow from "../components/AppServiceResourcesExpandedRow";
import { useAppServices } from "../hooks";
import { AppService } from "../types";

const AppServicesPage = () => {
  const { mutate, ...state } = useAppServices();
  const [] = useState();
  const title = "App Services";

  return (
    <When
      asyncState={{ ...state, data: state.appServices }}
      loading={() => <TableSkeleton />}
      error={(e) => <ErrorState error={e} title={title} />}
      success={(data) => {
        if (!data.length) return <EmptyState title={title} />;
        return (
          <DataTable
            columns={columns}
            data={data}
            renderExpandedRow={(row) => (
              <AppServiceResourcesExpandedRow service={row.original} />
            )}
          />
        );
      }}
    />
  );
};

export default AppServicesPage;

const columns: ColumnDef<AppService>[] = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={Boolean(
  //           table.getIsAllPageRowsSelected() ||
  //             (table.getIsSomePageRowsSelected() && "indeterminate") // Inderterminate should patially check the checkbox
  //         )}
  //         onChange={(value) =>
  //           table.toggleAllPageRowsSelected(value.currentTarget.checked)
  //         }
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onChange={(e) => row.toggleSelected(e.currentTarget.checked)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  {
    id: "expand",
    header: ({ table }) => {
      const allRowsExpanded = table.getIsAllRowsExpanded();
      //   const someRowsExpanded = table.getIsSomeRowsExpanded();
      return (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => table.toggleAllRowsExpanded(!allRowsExpanded)}
          style={{ cursor: "pointer" }}
          aria-label="Expand all"
        >
          <TablerIcon
            name={allRowsExpanded ? "chevronUp" : "chevronDown"}
            size={16}
          />
        </ActionIcon>
      );
    },
    cell: ({ row }) => {
      const rowExpanded = row.getIsExpanded();
      return (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => row.toggleExpanded(!rowExpanded)}
          style={{ cursor: "pointer" }}
          aria-label="Expand Row"
        >
          <TablerIcon
            name={rowExpanded ? "chevronUp" : "chevronDown"}
            size={16}
          />
        </ActionIcon>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "port",
    header({ column }) {
      return <DataTableColumnHeader title="Service Port" column={column} />;
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time Stamp" />
    ),
    cell({ row, getValue }) {
      const timestamp = getValue<number>();
      return <Chip>{new Date(timestamp).toDateString()}</Chip>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell({ row }) {
      const service = row.original;
      return (
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
              //   onClick={() => handleAddOrupdate(docType)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="trash" size={14} />}
              color="red"
              //   onClick={() => handleDelete(docType)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    },
  },
];
