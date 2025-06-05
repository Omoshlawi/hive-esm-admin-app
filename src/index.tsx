import * as React from "react";
import { Link } from "react-router-dom";
import type { PiletApi } from "@hive/esm-shell-app";
import { EXTENSION_SLOTS } from "./utils/constants";
import { NavLink } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { HeaderLink, withUserAccess } from "@hive/esm-core-components";
import MyOrganizationsPage from "./pages/MyOrganizationsPage";

const Page = React.lazy(() => import("./Page"));

export function setup(app: PiletApi) {
  const {
    getSession,
    exitOrganizationContext,
    switchOrganizationContext,
    session,
    launchWorkspace,
  } = app;

  app.registerPage("/", Page, { layout: "dashboard" });
  app.registerPage(
    "/dashboard/my-organizations",
    withUserAccess(
      () => (
        <MyOrganizationsPage
          session={session}
          exitOrganizationContext={exitOrganizationContext}
          switchOrganizationContext={switchOrganizationContext}
          launchWorkspace={launchWorkspace}
        />
      ),

      {
        getSession,
        isAuthenticated: (session) => session.isAuthenticated,
        requiresAuth: true,
      }
    ),
    {
      layout: "dashboard",
    }
  );
  app.registerExtension(
    EXTENSION_SLOTS.DASHBOARD_QUICK_ACTION_SLOT,
    React.lazy(() => import("./components/AddOrganizationQucikAction"))
  );
  app.registerMenu(
    ({ onClose }) => (
      <HeaderLink
        to="/dashboard/my-organizations"
        label="My Organizations"
        onClose={onClose ?? (() => {})}
      />
    ),
    {
      type: "admin",
    }
  );
}
