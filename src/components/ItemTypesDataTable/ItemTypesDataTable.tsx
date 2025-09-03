import type { ItemType } from "@/types/item-types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ItemType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  {
    accessorKey: "specs",
    header: "Specs",
  },
  {
    accessorKey: "corporates.name",
    header: "Corporate Name",
    cell: ({ row }) => row.original.corporates.name,
  },
];
