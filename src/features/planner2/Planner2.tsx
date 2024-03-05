import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { Grid } from "../grid/Grid";
import { Coord, Size, StageContext } from "../../contexts/StageContext";
import { Wall, WallType } from "../wall/Wall";

type PlannerState = {currentState: 'idle' | 'addingWallStart' | 'addingWallEnd'};
export type WallInProgressType = {
  start?: Coord;
  target?: Coord;
  end?: Coord;
}

const someWalls: WallType[] = [
  {uuid: '1', start: {x: 0, y: 0}, end: {x: 10, y: 0}, width: 3},
  {uuid: '2', start: {x: 0, y: 0}, end: {x: 0, y: 10}, width: 3},
  {uuid: '3', start: {x: 10, y: 0}, end: {x: 10, y: 10}, width: 3},
  {uuid: '4', start: {x: 0, y: 10}, end: {x: 10, y: 10}, width: 3},
]

export const Planner2 = () => {
  const [stageSize, setStageSize] = useState<Size>({ width: 800, height: 600 });
  const [stageWorldFocus, setStageWorldFocus] = useState<Coord>({ x: 0, y: 0 });
  const [stageZoom, setStageZoom] = useState<number>(50);
  const [plannerState, setPlannerState] = useState<PlannerState>({currentState: 'idle'});

  const [walls, setWalls] = useState<WallType[]>(someWalls);

  const [cursorPos, setCursorPos] = useState<Coord>({ x: -10, y: -10 });
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

  const getStageBounds = () => {
    return {
      left: stageWorldFocus.x - stageSize.width / 2 / stageZoom,
      right: stageWorldFocus.x + stageSize.width / 2 / stageZoom,
      top: stageWorldFocus.y - stageSize.height / 2 / stageZoom,
      bottom: stageWorldFocus.y + stageSize.height / 2 / stageZoom,
    };
  }



  const [wallInProgress, setWallInProgress] = useState<WallInProgressType>({});
  // get mouse position on stage
  const handleMouseMove = (e: any) => {

    const stagePos = e.target.getStage().getPointerPosition();
    const worldCoord = getWorldCoordFromStageCoord(stagePos);
    setCursorPos(stagePos);

    switch (plannerState.currentState) {
      case 'idle':
        break;
      case 'addingWallStart':
        break;
      case 'addingWallEnd':
        setWallInProgress({...wallInProgress, target: worldCoord});
        break;
      }
  };



  const handleClick = (e: any) => {
    const stagePos = e.target.getStage().getPointerPosition();
    const worldCoord = getWorldCoordFromStageCoord(stagePos);

    switch (plannerState.currentState) {
      case 'idle':
        break;
      case 'addingWallStart':
        console.log('addingWallStart', worldCoord);
        setWallInProgress({start: worldCoord});
        setPlannerState({currentState: 'addingWallEnd'});
        break;
      case 'addingWallEnd':
        console.log('addingWallEnd', worldCoord);
        
        setPlannerState({currentState: 'idle'});
        if (wallInProgress.start && wallInProgress.target) {
          const newWall: WallType = {uuid: 'temp', start: wallInProgress.start, end: worldCoord, width: 3};
          setWalls([...walls, newWall]);
          setWallInProgress({});
        }
        break;
      }
    }


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
      <p>
        <button onClick={() => {setPlannerState({currentState: 'addingWallStart'})}}>Add Wall</button>
      </p>
      <div style={{ width: stageSize.width, height: stageSize.height, }}>
        <StageContext.Provider value={{ stageSize, stageWorldFocus, stageZoom, setStageSize, setStageWorldFocus, setStageZoom, getWorldCoordFromStageCoord, getStageCoordFromWorldCoord, getStageBounds}}>
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onWheel={handleMouseWheel}
            style={{ border: "1px solid black" }}
          >
            <Layer>
              { plannerState.currentState !== 'idle' &&  <Circle x={cursorPos.x} y={cursorPos.y} stroke="black" radius={5} /> }
            </Layer>
            <Layer>

              <Grid />
              { walls.map((wall, index) => (  
                <Wall key={index} wall={wall} />
              )) }

              {wallInProgress.start && wallInProgress.target && <Wall wall={{uuid: 'temp', start: wallInProgress.start, end: wallInProgress.target, width: 3}} />}
            </Layer>
                
          </Stage>
        </StageContext.Provider>
      </div>
    </>
  );
};

