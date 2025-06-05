import * as React from "react";
import { Link } from "react-router-dom";
import type { PiletApi } from "@hive/esm-shell-app";
import { EXTENSION_SLOTS } from "./utils/constants";

const Page = React.lazy(() => import("./Page"));

export function setup(app: PiletApi) {
  const { getSession, exitOrganizationContext, switchOrganizationContext } =
    app;

  app.registerPage("/", Page, { layout: "dashboard" });
  app.registerExtension(
    EXTENSION_SLOTS.DASHBOARD_QUICK_ACTION_SLOT,
    React.lazy(() => import("./components/AddOrganizationQucikAction"))
  );
  app.registerMenu(() => <Link to="/page">Page</Link>, { type: "header" });
}
