import {
  HeaderLink,
  UserHasAccess,
  withUserAccess,
} from "@hive/esm-core-components";
import type { PiletApi } from "@hive/esm-shell-app";
import * as React from "react";
import MyOrganizationsPage from "./pages/MyOrganizationsPage";
import { EXTENSION_SLOTS } from "./utils/constants";
import PrivilegesPage from "./pages/PrivilegesPage";

const Page = React.lazy(() => import("./Page"));

export function setup(app: PiletApi) {
  const {
    exitOrganizationContext,
    switchOrganizationContext,
    launchWorkspace,
  } = app;
  app.registerPage("/", Page, { layout: "dashboard" });
  app.registerPage(
    "/dashboard/my-organizations",
    withUserAccess(
      () => <MyOrganizationsPage launchWorkspace={launchWorkspace} />,
      {
        isAuthenticated: (session) => session.isAuthenticated,
        requiresAuth: true,
        fallbackComponent: true,
      }
    ),
    {
      layout: "dashboard",
    }
  );
  app.registerPage(
    "/dashboard/privileges",
    withUserAccess(() => <PrivilegesPage launchWorkspace={launchWorkspace} />, {
      isAuthenticated: (session) => session.isAuthenticated,
      requiresAuth: true,
      fallbackComponent: null,
    }),
    {
      layout: "dashboard",
    }
  );
  app.registerExtension(
    EXTENSION_SLOTS.DASHBOARD_QUICK_ACTION_SLOT,
    React.lazy(() => import("./components/AddOrganizationQucikAction"))
  );
  app.registerExtension(
    EXTENSION_SLOTS.DASHBOARD_SIDE_NAV_CONTEXT_ITEMS_SLOT,
    () => (
      <UserHasAccess
        component={React.lazy(() => import("./components/ContextSwicher"))}
        componentProps={{
          exitOrganizationContext,
          switchOrganizationContext,
        }}
        isAuthenticated={(session) => session.isAuthenticated}
      />
    )
  );
  app.registerMenu(
    ({ onClose }: any) => (
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
  app.registerMenu(
    ({ onClose }: any) => (
      <HeaderLink
        to="/dashboard/privileges"
        label="Prividges"
        onClose={onClose ?? (() => {})}
      />
    ),
    {
      type: "admin",
    }
  );
}
