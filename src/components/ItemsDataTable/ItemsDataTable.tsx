import type { Item } from "@/types/item";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { StatusBadge } from "../StatusBadge/StatusBadge";

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "item_id",
    header: "Item ID",
  },
  {
    accessorKey: "item_types.name",
    header: "Item Type",
    cell: ({ row }) => row.original.item_types.name,
  },
  {
    accessorKey: "rooms.name",
    header: "Room",
    cell: ({ row }) => row.original.rooms.name,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "last_status",
    header: "Last Status",
    cell: ({ row }) => <StatusBadge status={row.original.last_status} />,
  },
  {
    accessorKey: "wash_count",
    header: "Wash Count",
  },
  {
    accessorKey: "procurement_date",
    header: "Procurement Date",
    cell: ({ row }) => {
      const date = new Date(row.original.procurement_date);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row, table }) => {
      const meta = table.options.meta;
      return (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 h-8 w-8"
            onClick={() => meta?.onViewDetails?.(row.original.item_id)}
          >
            <span className="sr-only">Details</span>
            <IconEye size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-500 hover:bg-blue-100 hover:text-blue-700 h-8 w-8"
            onClick={() => console.log("Edit item:", row.original.item_id)}
          >
            <span className="sr-only">Edit</span>
            <IconPencil size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100 hover:text-red-700 h-8 w-8"
            onClick={() => console.log("Delete item:", row.original.item_id)}
          >
            <span className="sr-only">Delete</span>
            <IconTrash size={18} />
          </Button>
        </div>
      );
    },
  },
];
