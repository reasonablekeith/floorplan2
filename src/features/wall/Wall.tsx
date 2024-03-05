import { Line } from "react-konva";
import { Coord, StageContext } from "../../contexts/StageContext";
import { useContext, useState } from "react";

export type WallType = {
  uuid: string;
  start: Coord;
  end: Coord;
  width: number;
  selectedUI?: boolean;
};

export const Wall = ({ wall, handleWallClick = () => {} }: { wall: WallType, handleWallClick?: (wall: WallType) => void }) => {
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
        onClick={() => handleWallClick(wall)}
        points={[
          wallStageCoordStart.x,
          wallStageCoordStart.y,
          wallStageCoordEnd.x,
          wallStageCoordEnd.y,
        ]}
        stroke={wall.selectedUI ? 'blue' : mouseOver? 'red' : 'black'}
        strokeWidth={(wall.width * stageContext.stageZoom) / 10}
      />
    </>
  );
};
