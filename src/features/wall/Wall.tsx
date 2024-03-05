import { Line } from "react-konva";
import { Coord, StageContext } from "../../contexts/StageContext";
import { useContext, useState } from "react";

export type WallType = {
  uuid: string;
  start: Coord;
  end: Coord;
  width: number;
};

export const Wall = ({ wall }: { wall: WallType }) => {
  const stageContext = useContext(StageContext);
  const wallStageCoordStart = stageContext.getStageCoordFromWorldCoord(
    wall.start
  );
  const wallStageCoordEnd = stageContext.getStageCoordFromWorldCoord(wall.end);

  const [mouseOver, setMouseOver] = useState<boolean>(false);

  return (
    <>
      <Line
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
        points={[
          wallStageCoordStart.x,
          wallStageCoordStart.y,
          wallStageCoordEnd.x,
          wallStageCoordEnd.y,
        ]}
        stroke={mouseOver? 'red' : 'black'}
        strokeWidth={(wall.width * stageContext.stageZoom) / 10}
      />
    </>
  );
};
