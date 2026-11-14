"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const HomeMotion = createContext<{
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
}>({ paused: false, setPaused: () => {} });

export function HomeMotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const value = useMemo(() => ({ paused, setPaused }), [paused]);
  return <HomeMotion.Provider value={value}>{children}</HomeMotion.Provider>;
}

export const useHomeMotion = () => useContext(HomeMotion);
