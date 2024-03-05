import { RoomType } from "../planner2/Planner2"

export const Room = ( {room, onChange}: {room: RoomType, onChange: (room: RoomType) => void} ) => {

  const addWalls = () => {
    // get selected wall from context
    // onChange({...room, wall: newWalls})
  }

  return (
    <div>
      Room name: <input type="text" value={room.name} onChange={ (e) => onChange({...room, name: e.target.value}) } />
      <button onClick={() => addWalls()}>Add Selected Walls</button>
    </div>
  )
}