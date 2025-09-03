import type { Transaction } from "@/types/transaction";
import type { ColumnDef } from "@tanstack/react-table";
import { TranscationStatusBadge } from "../StatusBadge/TransactionStatusBadge";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "total_qty",
    header: "Quantity",
  },
  {
    accessorKey: "wash_type",
    header: "Wash Type",
  },
  {
    accessorKey: "infectious_type",
    header: "Infectious Type",
  },
  {
    accessorKey: "total_weight",
    header: "Weight",
  },
  {
    accessorKey: "total_weight_scales",
    header: "Weight Scales",
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.transaction_date);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TranscationStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "corporates.name",
    header: "Corporate Name",
    cell: ({ row }) => row.original.corporates.name,
  },
];
