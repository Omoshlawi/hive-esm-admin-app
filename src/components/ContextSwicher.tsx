import { Button, Loader, Menu, useMantineTheme } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconArrowsUpDown,
  IconSettings,
} from "@tabler/icons-react";
import React, { useMemo } from "react";
import { useMyOrganizations } from "../hooks";
import { PiletApi } from "@hive/esm-shell-app";
import { TablerIcon, When } from "@hive/esm-core-components";
import { Organization } from "../types";
import { useSession } from "@hive/esm-core-api";
import { useMediaQuery } from "@mantine/hooks";
type ContextSwicherProps = Pick<
  PiletApi,
  "exitOrganizationContext" | "switchOrganizationContext"
> & {};

const ContextSwicher: React.FC<ContextSwicherProps> = ({
  exitOrganizationContext,
  switchOrganizationContext,
}) => {
  const isMobile = useMediaQuery("(max-width: 48em)");
  const session = useSession();
  const state = useMyOrganizations(session.user?.id);
  const { primaryColor } = useMantineTheme();
  const currentOrg = useMemo(() => {
    return state.organizationsMemberships.find(
      ({ organizationId }) => organizationId === session.currentOrganization
    )?.organization.name;
  }, [session, state]);
  const handleSwitchContext = (org: Organization) => {
    if (org.name !== currentOrg) {
      switchOrganizationContext(org.id);
    }
  };

  const handleExitContext = () => {
    if (currentOrg) {
      exitOrganizationContext();
    }
  };
  return (
    <Menu
      shadow="md"
      width={200}
      transitionProps={{ transition: "pop" }}
      position={isMobile ? "bottom" : "right-start"}
    >
      <Menu.Target>
        <Button
          mb={"md"}
          fullWidth
          variant="default"
          rightSection={<IconArrowsUpDown size={16} />}
          justify="space-between"
        >
          {currentOrg ?? "Individual"}
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
                  leftSection={
                    <TablerIcon
                      name={currentOrg ? "arrowsLeftRight" : "check"}
                      size={14}
                    />
                  }
                  bg={currentOrg ? undefined : primaryColor}
                  onClick={handleExitContext}
                >
                  Individual
                </Menu.Item>
                {data.map((org) => (
                  <Menu.Item
                    key={org.id}
                    leftSection={
                      <TablerIcon
                        name={
                          currentOrg === org.organization.name
                            ? "check"
                            : "arrowsLeftRight"
                        }
                        size={14}
                      />
                    }
                    bg={
                      currentOrg === org?.organization?.name
                        ? primaryColor
                        : undefined
                    }
                    onClick={() => handleSwitchContext(org.organization)}
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
