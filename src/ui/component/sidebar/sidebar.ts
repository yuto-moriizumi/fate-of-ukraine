export const SIDEBAR = {
    DEBUG: "DEBUG", DIPLOMACY: "DIPLOPMACY", NONE: "NONE"
} as const;

export type Sidebar = typeof SIDEBAR[keyof typeof SIDEBAR];