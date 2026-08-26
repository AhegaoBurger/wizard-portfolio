// os-context.js — the shell's navigation + theme API, in its own module so the
// pages can consume it without importing the shell (which imports the pages).
import { createContext, useContext } from 'react';

export const OSCtx = createContext(null);
export const useOS = () => useContext(OSCtx);

// Internal route ids (used by the dock, menus and hotspots) -> real URLs.
// Keeping real URLs matters here: a portfolio link needs to be shareable.
export const ROUTE_PATHS = {
  desktop: '/',
  grimoire: '/grimoire',
  spells: '/spells',
  lab: '/laboratory',
  contact: '/contact',
  404: '/404',
};
