import { Line } from "react-konva";
import { Coord, StageContext } from "../../contexts/StageContext";
import { useContext } from "react";

export type WallType = {
  uuid: string;
  start: Coord;
  end: Coord;
  width: number;
}

export const Wall = ({wall}: {wall: WallType}) => {

  const stageContext = useContext(StageContext);
  const wallStageCoordStart = stageContext.getStageCoordFromWorldCoord(wall.start);
  const wallStageCoordEnd = stageContext.getStageCoordFromWorldCoord(wall.end);

  return (
    <>
      <Line points={[
        wallStageCoordStart.x, wallStageCoordStart.y, wallStageCoordEnd.x, wallStageCoordEnd.y
      ]} stroke="black" strokeWidth={wall.width} />
    </>
  );
}