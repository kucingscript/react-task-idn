import { Badge } from "@/components/ui/badge";
import type { TransactionStatus } from "@/types/transaction";

interface StatusBadgeProps {
  status: TransactionStatus | null | undefined;
}

export const TranscationStatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) {
    return null;
  }

  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

  switch (status) {
    case "DONE":
      variant = "default";
      break;
    case "PENDING":
      variant = "destructive";
      break;
  }

  return (
    <Badge variant={variant} className="capitalize">
      {status.toLowerCase().replace("_", " ")}
    </Badge>
  );
};
