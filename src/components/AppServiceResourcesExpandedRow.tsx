import { handleApiErrors } from "@hive/esm-core-api";
import {
  ErrorState,
  TablerIcon,
  TableSkeleton,
  When,
} from "@hive/esm-core-components";
import {
  ActionIcon,
  Paper,
  Stack,
  Table,
  TableData,
  Title,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import React, { FC, useMemo } from "react";
import {
  useAppServicesResourceSchema,
  useAppServicesResourceSchemaApi,
} from "../hooks";
import { AppService } from "../types";

type AppServiceResourcesExpandedRowProps = {
  service: AppService;
};

const AppServiceResourcesExpandedRow: FC<
  AppServiceResourcesExpandedRowProps
> = ({ service }) => {
  const state = useAppServicesResourceSchema(service.name);
  const { sourceServiceResourcesSchema } = useAppServicesResourceSchemaApi();
  const handleConfirmSource = () => {
    openConfirmModal({
      title: "Source Confirmation",
      children: "Are you sure you want to source resource schema?",
      labels: { confirm: "Yes, source", cancel: "No, cancel" },
      centered: true,
      onConfirm: () => {
        sourceServiceResourcesSchema(service.name)
          .then(() => {
            showNotification({
              color: "teal",
              title: "Source Successfull",
              message: "Resource schema sourced successfully",
            });
          })
          .catch((error) => {
            showNotification({
              color: "red",
              title: "Error",
              message: handleApiErrors(error)?.detail,
            });
          });
      },
    });
  };

  const tableData = useMemo<TableData>(
    () => ({
      head: ["#", "Name", "Columns", "Actions"],
      body: Object.keys(state?.resourceSchemas?.schemas ?? {})?.map(
        (docType, i) => {
          const resourceData = state?.resourceSchemas?.schemas?.[docType];

          return [
            i + 1,
            docType,
            resourceData.columnNames.join(", "),

            <ActionIcon
              variant="outline"
              aria-label="Settings"
              onClick={handleConfirmSource}
            >
              <TablerIcon
                name="reload"
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>,
          ];
        }
      ),
    }),
    [state?.resourceSchemas]
  );
  return (
    <When
      asyncState={{ ...state, data: state.resourceSchemas }}
      error={(error) => <ErrorState error={error} />}
      loading={() => <TableSkeleton />}
      success={(data) => (
        <Paper withBorder m={"xl"} py={"md"} style={{ overflow: "auto" }}>
          <Stack>
            <Title px={"md"}>{`Service resources`}</Title>
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
          </Stack>
        </Paper>
      )}
    />
  );
};

export default AppServiceResourcesExpandedRow;
