import { RoomType } from "../planner2/Planner2"

export const PlannerRoom = ( {room, onChange, addSelectedWalls }: {room: RoomType, onChange: (room: RoomType) => void, addSelectedWalls: (uuid: string) => void} ) => {

  const addWalls = () => {
    // get selected wall from context
    // onChange({...room, wall: newWalls})
  }

  return (
    <div>
      Room name: <input type="text" value={room.name} onChange={ (e) => onChange({...room, name: e.target.value}) } />
      <button onClick={() => addSelectedWalls(room.uuid)}>Add Selected Walls</button>
      { room.wallUUIDs.map(w => (<p key={w}>{w}</p>)) }
    </div>
  )
}