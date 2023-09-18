export const SIDEBAR = {
  DEBUG: 'DEBUG',
  DIPLOMACY: 'DIPLOPMACY',
  PRODUCTION: 'PRODUCTION',
  NONE: 'NONE',
} as const;

export type Sidebar = typeof SIDEBAR[keyof typeof SIDEBAR];
