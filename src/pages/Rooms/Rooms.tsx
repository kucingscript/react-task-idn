import { getRooms } from "@/lib/roomService";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "@/components/RoomsDataTable/RoomsDataTable";
import { useDataTable } from "@/hooks/use-data-table";
import type { Room } from "@/types/room";
import Loader from "@/components/Loader/Loader";

const Rooms = () => {
  const {
    data,
    pageInfo,
    loading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
  } = useDataTable<Room>(getRooms, "Failed to fetch rooms.");

  if (error && data.length === 0) {
    return (
      <div className="p-4 lg:p-6 text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <Input
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pageInfo={pageInfo}
          currentPage={page}
          onPageChange={setPage}
          getRowId={(row) => row.room_id}
        />
      )}
    </div>
  );
};

export default Rooms;
