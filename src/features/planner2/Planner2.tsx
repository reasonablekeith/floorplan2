import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { Grid } from "../grid/Grid";
import { Coord, Size, StageContext } from "../../contexts/StageContext";


export const Planner2 = () => {
  const [stageSize, setStageSize] = useState<Size>({ width: 800, height: 600 });
  const [stageWorldFocus, setStageWorldFocus] = useState<Coord>({ x: 0, y: 0 });
  const [stageZoom, setStageZoom] = useState<number>(50);




  // const [stageStartCoord, setStageStartCoord] = useState<Coord>({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<Coord>({ x: -10, y: -10 });

  // useEffect(() => {
  //   setStageStartCoord({
  //     x: stageWorldFocus.x - stageSize.width / 2 / stageZoom,
  //     y: stageWorldFocus.y - stageSize.height / 2 / stageZoom,
  //   });
  // }, [stageZoom, stageWorldFocus, stageWorldFocus, stageSize]);

  const getWorldCoordFromStageCoord = (stageCoord: Coord) => {
    const xOffset = stageCoord.x -(stageSize.width / 2);
    const yOffset = -(stageCoord.y -(stageSize.height / 2));
    return { x: xOffset / stageZoom, y: yOffset / stageZoom}
  };
  
  const getStageCoordFromWorldCoord = (worldCoord: Coord) => {
    const x = worldCoord.x * stageZoom + stageSize.width / 2;
    const y = -worldCoord.y * stageZoom + stageSize.height / 2;
    return { x, y };
  }

  // get mouse position on stage
  const handleMouseMove = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    if (pos) {
      const worldCoord = getWorldCoordFromStageCoord(pos);
      const stageCoord = getStageCoordFromWorldCoord(worldCoord);
      setCursorPos(stageCoord);
    }
  };

  const handleMouseWheel = (e: any) => {
    const scaleAmount = -e.evt.deltaY / 100;
    var newStageZoom = stageZoom + scaleAmount;
    if (newStageZoom < 10) {
      newStageZoom = 10;
    }
    if (newStageZoom  > 200) {
      newStageZoom = 200;
    }
    // e.preventDefault();
    setStageZoom(newStageZoom);
  }

  return (
    <>
      {/* <p>
        {JSON.stringify(stageStartCoord, null, 2)} {JSON.stringify(stageSize)}  {stageZoom}
      </p> */}
      <div style={{ width: stageSize.width, height: stageSize.height, }}>
        <StageContext.Provider value={{ stageSize, stageWorldFocus, stageZoom, setStageSize, setStageWorldFocus, setStageZoom }}>
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onMouseMove={handleMouseMove}
          onWheel={handleMouseWheel}
          style={{ border: "1px solid black" }}
        >
          <Layer>
            <Circle x={cursorPos.x} y={cursorPos.y} stroke="black" radius={5} />
          </Layer>
          <Layer>

            <Grid />
          </Layer>
          
        </Stage>
        </StageContext.Provider>
      </div>
    </>
  );
};

