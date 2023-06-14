import React, { useCallback, useEffect, useState } from "react";

import "./App.css";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import "@blueprintjs/icons";

import { FocusStyleManager } from "@blueprintjs/core";

import { AssemblyApp } from "./AssemblyApp";
import { PartStudioApp } from "./PartStudioApp";
import { AppNavbar } from "./AppNavbar";

// Icons.load(["share", "arrow-right"]);

enum AppType {
  Assembly,
  PartStudio
}

export function App() {
  FocusStyleManager.onlyShowFocusOnTabs();

  const [appType, setAppType] = useState<AppType | undefined>(undefined);

  const fetchAppType = () => {
    const query = new URLSearchParams(window.location.search)
    if (query.get("type") === "assembly") {
      return AppType.Assembly;
    }
    else if (query.get("type") === "partstudio") {
      return AppType.PartStudio;
    }
    return undefined;
  }

  useEffect(() => { setAppType(fetchAppType()); }, []);

  const fetchApp = useCallback(() => {
    switch (appType) {
      case AppType.Assembly: {
        return <AssemblyApp />;
      }
      case AppType.PartStudio: {
        return <PartStudioApp />;
      }
      default: {
        return <AppNavbar />
      }
    }
  }, [appType]);

  return fetchApp();
}