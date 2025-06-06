import React, { useMemo } from "react";
import { useResources } from "../hooks";
import {
  ActionIcon,
  Button,
  Menu,
  Paper,
  Stack,
  Table,
  TableData,
  Title,
} from "@mantine/core";
import {
  EmptyState,
  ErrorState,
  TablerIcon,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import { IconPlus } from "@tabler/icons-react";

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
          <Paper component={Stack}>
            <Title>Resources</Title>
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
          </Paper>
        );
      }}
    />
  );
};

export default ResourcesPage;
