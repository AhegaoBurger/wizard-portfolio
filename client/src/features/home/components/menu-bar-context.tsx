import { createContext, useContext, useState, useCallback } from "react";
import type React from "react";

interface MenuBarActions {
  onReplayBoot?: () => void;
  onOpenTerminal?: () => void;
}

interface MenuBarActionsContextValue {
  actions: MenuBarActions;
  setActions: (actions: MenuBarActions) => void;
}

const MenuBarActionsContext = createContext<MenuBarActionsContextValue>({
  actions: {},
  setActions: () => {},
});

export function MenuBarActionsProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActionsState] = useState<MenuBarActions>({});

  const setActions = useCallback((newActions: MenuBarActions) => {
    setActionsState(newActions);
  }, []);

  return (
    <MenuBarActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </MenuBarActionsContext.Provider>
  );
}

export function useMenuBarActions() {
  return useContext(MenuBarActionsContext).actions;
}

export function useSetMenuBarActions() {
  return useContext(MenuBarActionsContext).setActions;
}
