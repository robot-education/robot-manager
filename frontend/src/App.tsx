import * as React from "react";

import "./app.scss";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { FocusStyleManager } from "@blueprintjs/core";

import { AssemblyApp } from "./assembly-app";
import { PartStudioApp } from "./part-studio-app";
import { AppNavbar } from "./app-navbar";

enum AppType {
  Assembly,
  PartStudio,
}

export function App() {
  FocusStyleManager.onlyShowFocusOnTabs();

  const [appType, setAppType] = React.useState<AppType | undefined>(undefined);

  const fetchAppType = () => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("type") === "assembly") {
      return AppType.Assembly;
    } else if (query.get("type") === "partstudio") {
      return AppType.PartStudio;
    }
    return undefined;
  };

  React.useEffect(() => {
    setAppType(fetchAppType());
  }, []);

  const fetchApp = React.useCallback(() => {
    switch (appType) {
      case AppType.Assembly: {
        return <AssemblyApp />;
      }
      case AppType.PartStudio: {
        return <PartStudioApp />;
      }
      default: {
        return <AppNavbar />;
      }
    }
  }, [appType]);

  return fetchApp();
}
