import {
  DashboardPageHeader,
  DataTable,
  EmptyState,
  ErrorState,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import { Box, Stack } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useResources } from "../hooks";
import { Resource } from "../types";

const ResourcesPage = () => {
  const resoucesAsync = useResources();
  const title = "Resources";

  return (
    <Stack>
      <Box>
        <DashboardPageHeader
          title="Resources"
          subTitle={"Data Resources"}
          icon={"shieldCheck"}
        />
      </Box>
      <When
        asyncState={{ ...resoucesAsync, data: resoucesAsync.resources }}
        loading={() => <TableSkeleton />}
        error={(e) => <ErrorState error={e} />}
        success={(data) => {
          if (!data.length) return <EmptyState message="No resources" />;
          return (
            <DataTable columns={columns} data={data} withColumnViewOptions />
          );
        }}
      />
    </Stack>
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
