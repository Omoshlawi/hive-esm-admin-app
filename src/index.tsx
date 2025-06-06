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
import RolesPage from "./pages/RolesPage";
import ResourcesPage from "./pages/ResourcesPage";
import AppServicesPage from "./pages/AppServicesPage";

export function setup(app: PiletApi) {
  const {
    exitOrganizationContext,
    switchOrganizationContext,
    launchWorkspace,
  } = app;
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
  app.registerPage(
    "/dashboard/roles",
    withUserAccess(() => <RolesPage launchWorkspace={launchWorkspace} />, {
      isAuthenticated: (session) => session.isAuthenticated,
      requiresAuth: true,
      fallbackComponent: null,
    }),
    {
      layout: "dashboard",
    }
  );
  app.registerPage(
    "/dashboard/resources",
    withUserAccess(ResourcesPage, {
      isAuthenticated: (session) => session.isAuthenticated,
      requiresAuth: true,
      fallbackComponent: null,
    }),
    {
      layout: "dashboard",
    }
  );
  app.registerPage(
    "/dashboard/app-services",
    withUserAccess(AppServicesPage, {
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
  app.registerMenu(
    ({ onClose }: any) => (
      <HeaderLink
        to="/dashboard/roles"
        label="Roles"
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
        to="/dashboard/resources"
        label="Resources"
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
        to="/dashboard/app-services"
        label="App services"
        onClose={onClose ?? (() => {})}
      />
    ),
    {
      type: "admin",
    }
  );
}
