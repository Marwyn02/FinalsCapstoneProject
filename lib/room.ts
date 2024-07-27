import db from "./db";

export async function getRooms() {
  const rooms = await db.room.findMany();

  return rooms;
}
