import { createContext } from "react";

export type Size = {
  width: number;
  height: number;
};
export type Coord = {
  x: number;
  y: number;
};

export type StageContextType = {
  stageSize: Size;
  setStageSize: (size: Size) => void;
  stageWorldFocus: Coord;
  setStageWorldFocus: (coord: Coord) => void;
  stageZoom: number;
  setStageZoom: (zoom: number) => void;
  getWorldCoordFromStageCoord: (stageCoord: Coord) => Coord;
  getStageCoordFromWorldCoord: (worldCoord: Coord) => Coord;
};
export const StageContext = createContext<StageContextType>({
  stageSize: { width: 0, height: 0 },
  setStageSize: (size: Size) => {},
  stageWorldFocus: { x: 0, y: 0 },
  setStageWorldFocus: (coord: Coord) => {},
  stageZoom: 0,
  setStageZoom: (zoom: number) => {},
  getWorldCoordFromStageCoord: (stageCoord: Coord) => ({ x: 0, y: 0 }),
  getStageCoordFromWorldCoord: (worldCoord: Coord) => ({ x: 0, y: 0 }),
});
