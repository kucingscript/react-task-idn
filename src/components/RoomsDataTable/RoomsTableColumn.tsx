import type { Room } from "@/types/room";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "corporates.name",
    header: "Corporate Name",
    cell: ({ row }) => row.original.corporates.name,
  },
];
