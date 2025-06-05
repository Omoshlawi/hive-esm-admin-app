import {
  EmptyState,
  ErrorState,
  TableContainer,
  TablerIcon,
  When,
} from "@hive/esm-core-components";
import { PiletApi } from "@hive/esm-shell-app";
import {
  ActionIcon,
  Loader,
  Menu,
  Table,
  TableData,
  Text,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import React, { FC, useMemo } from "react";
import OrgaznizationForm from "../forms/OrgaznizationForm";
import { useMyOrganizations } from "../hooks";
import { Organization } from "../types";
import { useSession } from "@hive/esm-core-api";

type MyOrganizationsPageProps = Pick<PiletApi, "launchWorkspace"> & {};

const MyOrganizationsPage: FC<MyOrganizationsPageProps> = ({
  launchWorkspace,
}) => {
  const session = useSession();
  const state = useMyOrganizations(session.user?.id);
  const title = "My Organizations";
  const handleUpdate = (organization: Organization) => {
    const dispose = launchWorkspace(
      <OrgaznizationForm
        organization={organization}
        // onSuccess={() => dispose()}
        onCloseWorkspace={() => dispose()}
      />,
      { title: "Update amenity" }
    );
  };

  const handleDelete = (organization: Organization) => {
    openConfirmModal({
      title: "Delete Organization",
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
      head: ["Name", "Description", "CreatedAt", "Actions"],
      body: state?.organizationsMemberships.map((docType) => [
        docType.organization.name,
        docType.organization.description,
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
              onClick={() => handleUpdate(docType.organization)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="trash" size={14} />}
              color="red"
              onClick={() => handleDelete(docType.organization)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>,
      ]),
    }),
    [state.organizationsMemberships]
  );
  return (
    <div>
      <When
        asyncState={{ ...state, data: state.organizationsMemberships }}
        loading={() => <Loader />}
        error={(e) => <ErrorState error={e} headerTitle={title} />}
        success={(data) => {
          if (!data.length) return <EmptyState headerTitle={title} />;
          return (
            <TableContainer title={title}>
              <Table data={tableData} />
            </TableContainer>
          );
        }}
      />
    </div>
  );
};

export default MyOrganizationsPage;
