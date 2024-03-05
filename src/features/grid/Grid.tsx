import { Rect } from "react-konva";
import { useContext, useEffect, useState } from "react";
import { Coord, StageContext } from "../../contexts/StageContext";


export const Grid = () => {

  type GridLine = {
    start: Coord;
    direction: 'h' | 'v'
  }

  const stageContext = useContext(StageContext);

  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  
  useEffect(() => {
    
    const {left, right, top, bottom} = stageContext.getStageBounds();

    const tempGridLines: GridLine[] = [];
    // console.log('left', left, 'right', right, 'stageSize', stageContext.stageSize, 'stageWorldFocus', stageContext.stageWorldFocus, 'stageZoom', stageContext.stageZoom)
    for (let x = Math.floor(left); x < right; x += 1) {
      const stageCoord = stageContext.getStageCoordFromWorldCoord({x, y: 0});
      tempGridLines.push({ direction: 'v', start: {x: stageCoord.x, y: 0}} );
    }
    for(let y = Math.ceil(top); y < bottom; y += 1) {
      const stageCoord = stageContext.getStageCoordFromWorldCoord({x: 0, y});
      tempGridLines.push({ direction: 'h', start: {x: 0, y: stageCoord.y}} );
    }

    setGridLines(tempGridLines);
  }, [stageContext]);


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