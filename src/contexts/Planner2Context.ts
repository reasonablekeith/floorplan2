import { createContext } from "react";

export type Planner2ContextType = {
  test: number
}
export const Planner2Context = createContext<Planner2ContextType>(
  {test: 0}
);