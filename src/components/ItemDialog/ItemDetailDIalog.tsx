import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Item } from "@/types/item";
import { ItemStatusBadge } from "../StatusBadge/ItemStatusBadge";

interface ItemDetailDialogProps {
  item: Item | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ItemDetailDialog = ({
  item,
  isOpen,
  onOpenChange,
}: ItemDetailDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Item Detail: {item.item_id}</DialogTitle>
          <DialogDescription>
            Detailed information for {item.item_types.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-muted-foreground">Item Type</span>
            <span>{item.item_types.name}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-muted-foreground">Room</span>
            <span>{item.rooms.name}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-muted-foreground">Status</span>
            <ItemStatusBadge status={item.status} />
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-muted-foreground">Last Status</span>
            <ItemStatusBadge status={item.last_status} />
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-muted-foreground">Wash Count</span>
            <span>{item.wash_count}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <span className="text-muted-foreground">Procurement Date</span>
            <span>{new Date(item.procurement_date).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
