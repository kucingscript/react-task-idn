import { Badge } from "@/components/ui/badge";
import type { ItemStatus } from "@/types/item";

interface StatusBadgeProps {
  status: ItemStatus | null | undefined;
}

export const ItemStatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) {
    return null;
  }

  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

  switch (status) {
    case "CLEAN":
    case "STORED":
      variant = "default";
      break;
    case "WASH":
    case "SENT":
    case "REGISTERED":
      variant = "outline";
      break;
    case "USED":
    case "DIRT":
      variant = "secondary";
      break;
    case "DEFECT":
      variant = "destructive";
      break;
  }

  return (
    <Badge variant={variant} className="capitalize">
      {status.toLowerCase().replace("_", " ")}
    </Badge>
  );
};
