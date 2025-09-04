import type { Item } from "@/types/item";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { ItemStatusBadge } from "../StatusBadge/ItemStatusBadge";
import { formattedDate } from "@/lib/utils";

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
    cell: ({ row }) => <ItemStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "last_status",
    header: "Last Status",
    cell: ({ row }) => <ItemStatusBadge status={row.original.last_status} />,
  },
  {
    accessorKey: "wash_count",
    header: "Wash Count",
  },
  {
    accessorKey: "procurement_date",
    header: "Procurement Date",
    cell: ({ row }) => formattedDate({ date: row.original.procurement_date }),
  },
  {
    accessorKey: "vendors.name",
    header: "Vendor",
    cell: ({ row }) => {
      return row.original.vendors ? row.original.vendors.name : "-";
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
            onClick={() => meta?.onEdit?.(row.original)}
          >
            <span className="sr-only">Edit</span>
            <IconPencil size={18} />
          </Button>
        </div>
      );
    },
  },
];
