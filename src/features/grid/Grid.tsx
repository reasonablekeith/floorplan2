import { Rect } from "react-konva";
import { Coord, Size } from "../planner2/Planner2";
import { useEffect, useState } from "react";


export const Grid = ({stageSize, stageWorldFocus, stageZoom}: {stageSize: Size, stageWorldFocus: Coord, stageZoom: number} ) => {

  type GridLine = {
    start: Coord;
    direction: 'h' | 'v'
  }

  const getStageCoordFromWorldCoord = (worldCoord: Coord) => {
    const x = worldCoord.x * stageZoom + stageSize.width / 2;
    const y = -worldCoord.y * stageZoom + stageSize.height / 2;
    return { x, y };
  }

  
  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  
  useEffect(() => {
    
    const left = stageWorldFocus.x - stageSize.width / 2 / stageZoom;
    const right = stageWorldFocus.x + stageSize.width / 2 / stageZoom;
    const top = stageWorldFocus.y - stageSize.height / 2 / stageZoom;
    const bottom = stageWorldFocus.y + stageSize.height / 2 / stageZoom;

    const tempGridLines: GridLine[] = [];
    console.log('left', left, 'right', right, 'stageSize', stageSize, 'stageWorldFocus', stageWorldFocus, 'stageZoom', stageZoom)
    for (let x = left; x < right; x += 1) {
      const stageCoord = getStageCoordFromWorldCoord({x, y: 0});
      tempGridLines.push({ direction: 'v', start: {x: stageCoord.x, y: 0}} );
    }
    for(let y = top; y < bottom; y += 1) {
      const stageCoord = getStageCoordFromWorldCoord({x: 0, y});
      tempGridLines.push({ direction: 'h', start: {x: 0, y: stageCoord.y}} );
    }

    setGridLines(tempGridLines);
  }, [stageSize, stageWorldFocus, stageZoom]);


  return (
    <>
      {gridLines.map((line, index) => (
        <Rect
          key={index}
          x={line.start.x}
          y={line.start.y}
          width={line.direction === 'h' ? stageSize.width : 1}
          height={line.direction === 'v' ? stageSize.height : 1}
          fill="lightgrey"
        />
      ))}
    </>
  );
}