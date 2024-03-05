import { Rect } from "react-konva";
import { useContext, useEffect, useState } from "react";
import { Coord, StageContext } from "../../contexts/StageContext";


export const Grid = () => {

  type GridLine = {
    start: Coord;
    direction: 'h' | 'v'
  }

  const stageContext = useContext(StageContext);

  const getStageCoordFromWorldCoord = (worldCoord: Coord) => {
    const x = worldCoord.x * stageContext.stageZoom + stageContext.stageSize.width / 2;
    const y = -worldCoord.y * stageContext.stageZoom + stageContext.stageSize.height / 2;
    return { x, y };
  }

  
  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  
  useEffect(() => {
    
    const left = stageContext.stageWorldFocus.x - stageContext.stageSize.width / 2 / stageContext.stageZoom;
    const right = stageContext.stageWorldFocus.x + stageContext.stageSize.width / 2 / stageContext.stageZoom;
    const top = stageContext.stageWorldFocus.y - stageContext.stageSize.height / 2 / stageContext.stageZoom;
    const bottom = stageContext.stageWorldFocus.y + stageContext.stageSize.height / 2 / stageContext.stageZoom;

    const tempGridLines: GridLine[] = [];
    console.log('left', left, 'right', right, 'stageSize', stageContext.stageSize, 'stageWorldFocus', stageContext.stageWorldFocus, 'stageZoom', stageContext.stageZoom)
    for (let x = left; x < right; x += 1) {
      const stageCoord = getStageCoordFromWorldCoord({x, y: 0});
      tempGridLines.push({ direction: 'v', start: {x: stageCoord.x, y: 0}} );
    }
    for(let y = top; y < bottom; y += 1) {
      const stageCoord = getStageCoordFromWorldCoord({x: 0, y});
      tempGridLines.push({ direction: 'h', start: {x: 0, y: stageCoord.y}} );
    }

    setGridLines(tempGridLines);
  }, [stageContext, getStageCoordFromWorldCoord]);


  return (
    <>
      {gridLines.map((line, index) => (
        <Rect
          key={index}
          x={line.start.x}
          y={line.start.y}
          width={line.direction === 'h' ? stageContext.stageSize.width : 1}
          height={line.direction === 'v' ? stageContext.stageSize.height : 1}
          fill="lightgrey"
        />
      ))}
    </>
  );
}