import * as React from "react";

import "./app.scss";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Outlet } from "react-router-dom";

import { FocusStyleManager } from "@blueprintjs/core";

export function Root() {
  FocusStyleManager.onlyShowFocusOnTabs();
  return <Outlet />;
}
