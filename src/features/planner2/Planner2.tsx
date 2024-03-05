import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { Grid } from "../grid/Grid";
import { Coord, Size, StageContext } from "../../contexts/StageContext";
import { Wall, WallType } from "../wall/Wall";
import { v4 as uuid } from "uuid";
import { Room } from "../room/Room";

type PlannerState = {
  currentState:
    | "idle"
    | "addingWallStart"
    | "addingWallEnd"
    | "deleteWall"
    | "selectStart"
    | "selectEnd";
};
export type WallInProgressType = {
  start?: Coord;
  target?: Coord;
  end?: Coord;
};

export type RoomType = {
  uuid: string;
  name: string;
  walls: WallType[];
};

type SelectorType = {
  start?: Coord;
  end?: Coord;
};

const someWalls: WallType[] = [
  { uuid: "1", start: { x: 0, y: 0 }, end: { x: 10, y: 0 }, width: 3 },
  { uuid: "2", start: { x: 0, y: 0 }, end: { x: 0, y: 10 }, width: 3 },
  { uuid: "3", start: { x: 10, y: 0 }, end: { x: 10, y: 10 }, width: 3 },
  { uuid: "4", start: { x: 0, y: 10 }, end: { x: 10, y: 10 }, width: 3 },
];

export const Planner2 = () => {
  const [stageSize, setStageSize] = useState<Size>({ width: 800, height: 600 });
  const [stageWorldFocus, setStageWorldFocus] = useState<Coord>({ x: 0, y: 0 });
  const [stageZoom, setStageZoom] = useState<number>(50);
  const [plannerState, setPlannerState] = useState<PlannerState>({
    currentState: "idle",
  });

  const [walls, setWalls] = useState<WallType[]>(someWalls);

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [uiSelector, setUISelector] = useState<SelectorType>({});

  const [cursorPos, setCursorPos] = useState<Coord>({ x: -10, y: -10 });
  const getWorldCoordFromStageCoord = (stageCoord: Coord) => {
    const xOffset = stageCoord.x - stageSize.width / 2;
    const yOffset = -(stageCoord.y - stageSize.height / 2);
    return { x: xOffset / stageZoom, y: yOffset / stageZoom };
  };
  const getStageCoordFromWorldCoord = (worldCoord: Coord) => {
    const x = worldCoord.x * stageZoom + stageSize.width / 2;
    const y = -worldCoord.y * stageZoom + stageSize.height / 2;
    return { x, y };
  };

  const getStageBounds = () => {
    return {
      left: stageWorldFocus.x - stageSize.width / 2 / stageZoom,
      right: stageWorldFocus.x + stageSize.width / 2 / stageZoom,
      top: stageWorldFocus.y - stageSize.height / 2 / stageZoom,
      bottom: stageWorldFocus.y + stageSize.height / 2 / stageZoom,
    };
  };

  const snapWorldCoordToGrid = (worldCoord: Coord): Coord => {
    return { x: +worldCoord.x.toFixed(0), y: +worldCoord.y.toFixed(0) };
  };

  const getWallsInBound = (start: Coord, end: Coord): string[] => {
    const left = Math.min(start.x, end.x);
    const right = Math.max(start.x, end.x);
    const top = Math.max(start.y, end.y);
    const bottom = Math.min(start.y, end.y);
    console.log("left: ", left, "right: ", right, "top: ", top, "bottom: ", bottom)
    const uuids = walls.filter(
      (wall) =>  
        wall.start.x > left && 
        wall.start.x < right &&
        wall.end.x > left && 
        wall.end.x < right &&
        wall.start.y < top &&
        wall.start.y > bottom &&
        wall.end.y < top &&
        wall.end.y > bottom 
      ).map((wall) => wall.uuid);
      if (uuids.length > 0) {
        console.log("walls in bound: ", uuids);
      }
    return uuids;
  }

  const [wallInProgress, setWallInProgress] = useState<WallInProgressType>({});
  // get mouse position on stage
  const handleMouseMove = (e: any) => {
    const stagePos = e.target.getStage().getPointerPosition();
    const worldCoord = getWorldCoordFromStageCoord(stagePos);
    setCursorPos(getStageCoordFromWorldCoord(snapWorldCoordToGrid(worldCoord)));

    switch (plannerState.currentState) {
      case "idle":
        break;
      case "addingWallStart":
        break;
      case "addingWallEnd":
        setWallInProgress({
          ...wallInProgress,
          target: snapWorldCoordToGrid(worldCoord),
        });
        break;
      case "selectEnd":
        setUISelector({
          ...uiSelector,
          end: getStageCoordFromWorldCoord(worldCoord),
        });
        if (uiSelector.start && uiSelector.end) {
          getWallsInBound(getWorldCoordFromStageCoord(uiSelector.start), worldCoord);
        }
        // get the selected items
        break;
    }
  };

  const handleWallClick = (wall: WallType) => {
    if (plannerState.currentState === "deleteWall") {
      setWalls(walls.filter((w) => w.uuid !== wall.uuid));
    }
  };

  const handleClick = (e: any) => {
    // const stagePos = e.target.getStage().getPointerPosition();
    const worldCoord = getWorldCoordFromStageCoord(cursorPos);

    switch (plannerState.currentState) {
      case "idle":
        break;
      case "addingWallStart":
        console.log("addingWallStart", worldCoord);
        setWallInProgress({ start: worldCoord });
        setPlannerState({ currentState: "addingWallEnd" });
        break;
      case "addingWallEnd":
        console.log("addingWallEnd", worldCoord);

        setPlannerState({ currentState: "idle" });
        if (wallInProgress.start && wallInProgress.target) {
          const newWall: WallType = {
            uuid: uuid(),
            start: wallInProgress.start,
            end: worldCoord,
            width: 3,
          };
          setWalls([...walls, newWall]);
          setWallInProgress({});
        }
        break;
      case "selectStart":
        setUISelector({
          ...uiSelector,
          start: getStageCoordFromWorldCoord(worldCoord),
        });
        setPlannerState({ currentState: "selectEnd" });
        break;
      case "selectEnd":
        setUISelector({});
        setPlannerState({ currentState: "idle" });
        break;
    }
  };

  const handleMouseWheel = (e: any) => {
    const scaleAmount = -e.evt.deltaY / 100;
    var newStageZoom = stageZoom + scaleAmount;
    if (newStageZoom < 10) {
      newStageZoom = 10;
    }
    if (newStageZoom > 200) {
      newStageZoom = 200;
    }
    // e.preventDefault();
    setStageZoom(newStageZoom);
  };

  const handleRoomChange = (room: RoomType) => {
    setRooms(rooms.map((r) => (r.uuid === room.uuid ? room : r)));
  };

  return (
    <>
      {/* <p>
        {JSON.stringify(rooms, null, 2)} 
      </p> */}
      <p>
        <button
          onClick={() => {
            setPlannerState({ currentState: "addingWallStart" });
          }}
        >
          Add Wall
        </button>
        <button
          onClick={() => {
            setPlannerState({ currentState: "deleteWall" });
          }}
        >
          Delete Wall
        </button>
        <button
          onClick={() => {
            setPlannerState({ currentState: "selectStart" });
          }}
        >
          []
        </button>
      </p>
      <div style={{ width: stageSize.width, height: stageSize.height }}>
        <StageContext.Provider
          value={{
            stageSize,
            stageWorldFocus,
            stageZoom,
            setStageSize,
            setStageWorldFocus,
            setStageZoom,
            getWorldCoordFromStageCoord,
            getStageCoordFromWorldCoord,
            getStageBounds,
          }}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onWheel={handleMouseWheel}
            style={{ border: "1px solid black" }}
          >
            <Layer>
              {plannerState.currentState !== "idle" && (
                <Circle
                  x={cursorPos.x}
                  y={cursorPos.y}
                  stroke="black"
                  radius={5}
                />
              )}
            </Layer>
            <Layer>
              <Grid />
              {walls.map((wall, index) => (
                <Wall
                  key={index}
                  wall={wall}
                  handleWallClick={handleWallClick}
                />
              ))}

              {wallInProgress.start && wallInProgress.target && (
                <Wall
                  wall={{
                    uuid: uuid(),
                    start: wallInProgress.start,
                    end: wallInProgress.target,
                    width: 3,
                  }}
                />
              )}

              {uiSelector.start && uiSelector.end && (
                <Rect
                  x={uiSelector.start.x}
                  y={uiSelector.start.y}
                  width={uiSelector.end.x - uiSelector.start.x}
                  height={uiSelector.end.y - uiSelector.start.y}
                  stroke="black"
                  strokeWidth={1}
                />
              )}
            </Layer>
          </Stage>

          <p>
            <button
              onClick={() => {
                setRooms([...rooms, { uuid: uuid(), name: "room", walls: [] }]);
              }}
            >
              Add Room
            </button>
          </p>
          <div>
            {rooms.map((room, index) => (
              <Room key={index} room={room} onChange={handleRoomChange} />
            ))}
          </div>
        </StageContext.Provider>
      </div>
    </>
  );
};
