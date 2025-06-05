import { Button, Loader, Menu } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconSettings,
} from "@tabler/icons-react";
import React, { useMemo } from "react";
import { useMyOrganizations } from "../hooks";
import { PiletApi } from "@hive/esm-shell-app";
import { When } from "@hive/esm-core-components";
type ContextSwicherProps = Pick<
  PiletApi,
  | "session"
  | "launchWorkspace"
  | "exitOrganizationContext"
  | "switchOrganizationContext"
> & {};

const ContextSwicher: React.FC<ContextSwicherProps> = ({
  session,
  exitOrganizationContext,
  launchWorkspace,
  switchOrganizationContext,
}) => {
  const state = useMyOrganizations(session.user?.id);
  const currentOrg = useMemo(() => {
    return state.organizationsMemberships.find(
      ({ organizationId }) => organizationId === session.currentOrganization
    )?.organization.name;
  }, [session.currentOrganization, state.organizationsMemberships]);

  return (
    <Menu
      shadow="md"
      width={200}
      transitionProps={{ transition: "pop" }}
      position="right-start"
    >
      <Menu.Target>
        <Button
          mb={"md"}
          fullWidth
          variant="default"
          rightSection={<IconArrowsUpDown size={16} />}
          justify="space-between"
        >
          {currentOrg ?? "Switch Context"}
        </Button>
      </Menu.Target>
      <Menu.Dropdown flex={1}>
        <When
          asyncState={{ ...state, data: state.organizationsMemberships }}
          loading={() => <Loader />}
          success={(data) => {
            if (data.length === 0)
              return (
                <Menu.Item leftSection={<IconSettings size={14} />} disabled>
                  No organizations
                </Menu.Item>
              );
            return (
              <>
                <Menu.Item
                  leftSection={<IconArrowsLeftRight size={14} />}
                  bg={currentOrg ? undefined : "teal"}
                  onClick={currentOrg ? undefined : exitOrganizationContext}
                >
                  Individual
                </Menu.Item>
                {data.map((org) => (
                  <Menu.Item
                    key={org.id}
                    leftSection={<IconArrowsLeftRight size={14} />}
                    bg={
                      currentOrg === org?.organization?.name
                        ? "teal"
                        : undefined
                    }
                    onClick={
                      currentOrg
                        ? () => switchOrganizationContext(org.organizationId)
                        : undefined
                    }
                  >
                    {org.organization.name}
                  </Menu.Item>
                ))}
              </>
            );
          }}
        />
      </Menu.Dropdown>
    </Menu>
  );
};

export default ContextSwicher;
