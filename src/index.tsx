import { HeaderLink, UserHasAccess } from "@hive/esm-core-components";
import type { PiletApi } from "@hive/esm-shell-app";
import * as React from "react";
import {
  Appservices,
  MyOrganizations,
  OrganizationStaff,
  Privileges,
  Resources,
  Roles,
} from "./pages";
import { EXTENSION_SLOTS } from "./utils/constants";

export function setup(app: PiletApi) {
  const {
    exitOrganizationContext,
    switchOrganizationContext,
    launchWorkspace,
  } = app;
  app.registerPage(
    "/dashboard/my-organizations",
    () => <MyOrganizations launchWorkspace={launchWorkspace} />,
    {
      layout: "dashboard",
    }
  );
  app.registerPage(
    "/dashboard/staff",
    () => <OrganizationStaff launchWorkspace={launchWorkspace} />,
    {
      layout: "dashboard",
    }
  );
  app.registerPage(
    "/dashboard/privileges",
    () => <Privileges launchWorkspace={launchWorkspace} />,
    {
      layout: "dashboard",
    }
  );
  app.registerPage(
    "/dashboard/roles",
    () => <Roles launchWorkspace={launchWorkspace} />,
    {
      layout: "dashboard",
    }
  );
  app.registerPage("/dashboard/resources", Resources, {
    layout: "dashboard",
  });
  app.registerPage("/dashboard/app-services", Appservices, {
    layout: "dashboard",
  });
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
        icon="buildings"
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
        icon="shieldCheck"
      />
    ),
    {
      type: "admin",
    }
  );
  app.registerMenu(
    ({ onClose }: any) => (
      <HeaderLink
        to="/dashboard/roles"
        label="Roles"
        onClose={onClose ?? (() => {})}
        icon="userShield"
      />
    ),
    {
      type: "admin",
    }
  );
  app.registerMenu(
    ({ onClose }: any) => (
      <HeaderLink
        to="/dashboard/resources"
        label="Resources"
        onClose={onClose ?? (() => {})}
        icon="database"
      />
    ),
    {
      type: "admin",
    }
  );
  app.registerMenu(
    ({ onClose }: any) => (
      <HeaderLink
        to="/dashboard/app-services"
        label="App services"
        onClose={onClose ?? (() => {})}
        icon="server2"
      />
    ),
    {
      type: "admin",
    }
  );
  app.registerMenu(
    ({ onClose }: any) => (
      <HeaderLink
        to="/dashboard/staff"
        label="Staffs"
        onClose={onClose ?? (() => {})}
        icon="usersGroup"
      />
    ),
    {
      type: "admin",
    }
  );
}
