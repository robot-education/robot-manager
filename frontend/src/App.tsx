import React from "react";

import "./App.css";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { AssemblyApp } from "./AssemblyApp";
import { FocusStyleManager } from "@blueprintjs/core";

export function App() {
  FocusStyleManager.onlyShowFocusOnTabs();
  return (
    <AssemblyApp />
  );
}