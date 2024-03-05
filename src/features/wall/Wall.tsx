import { Line } from "react-konva";
import { Coord } from "../../contexts/StageContext";

export type Wall = {
  uuid: string;
  start: Coord;
  end: Coord;
  width: number;
}

export const Wall = ({wall}: {wall: Wall}) => {
  return (
    <>
      <Line points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]} stroke="black" strokeWidth={wall.width} />
    </>
  );
}