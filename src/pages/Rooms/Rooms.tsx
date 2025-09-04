import { columns } from "@/components/RoomsDataTable/RoomsDataTable";
import { ResourcePage } from "@/components/ResourcePage/ResourcePage";
import { getRooms } from "@/lib/roomService";
import type { Room } from "@/types/room";

const Rooms = () => {
  return (
    <ResourcePage<Room>
      title="Rooms"
      fetcher={getRooms}
      columns={columns}
      getRowId={(row) => row.room_id}
      searchPlaceholder="Search rooms..."
    />
  );
};

export default Rooms;
