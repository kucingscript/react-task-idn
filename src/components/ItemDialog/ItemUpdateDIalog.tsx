import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Item, UpdateItemPayload } from "@/types/item";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import type { Room } from "@/types/room";
import type { ItemType } from "@/types/item-types";
import { getRooms } from "@/lib/roomService";
import { getItemTypes } from "@/lib/ItemTypesService";
import { toast } from "sonner";
import { updateItem } from "@/lib/itemService";
import { useAuthStore } from "@/store/auth";
import { FormSelect } from "../FormSelect/FormSelect";

const schema = yup.object().shape({
  item_type_id: yup.string().required("Item Type is required"),
  room_id: yup.string().required("Room is required"),
});

interface ItemUpdateDialogProps {
  item: Item | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

type ItemUpdateFormValues = Omit<UpdateItemPayload, "corporate_id">;

const ItemUpdateDialog = ({
  item,
  isOpen,
  onOpenChange,
  onSuccess,
}: ItemUpdateDialogProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const { user } = useAuthStore();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ItemUpdateFormValues>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (item) {
      setValue("item_type_id", item.item_types.item_type_id);
      setValue("room_id", item.rooms.room_id);
    }
  }, [item, setValue]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const roomsRes = await getRooms({ limit: 1000 });
        if (roomsRes.code === 0) setRooms(roomsRes.data);
        const itemTypesRes = await getItemTypes({ limit: 1000 });
        if (itemTypesRes.code === 0) setItemTypes(itemTypesRes.data);
      } catch (err) {
        toast.error("Failed to load filter options.");
        console.error(err);
      }
    };
    fetchFilterData();
  }, []);

  const onSubmit = async (data: ItemUpdateFormValues) => {
    if (!item || !user) return;

    try {
      const payload: UpdateItemPayload = {
        ...data,
        corporate_id: user.corporates.corporate_id,
      };
      const response = await updateItem(item.item_id, payload);
      if (response.code === 0) {
        toast.success("Item updated successfully");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update item.");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Item: {item.item_id}</DialogTitle>
          <DialogDescription>
            Update the details for {item.item_types.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4 text-sm">
            <FormSelect
              control={control}
              name="item_type_id"
              label="Item Type"
              placeholder="Select Item Type"
              options={itemTypes.map((it) => ({
                value: it.item_type_id,
                label: it.name,
              }))}
              errors={errors}
            />
            <FormSelect
              control={control}
              name="room_id"
              label="Room"
              placeholder="Select Room"
              options={rooms.map((room) => ({
                value: room.room_id,
                label: room.name,
              }))}
              errors={errors}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemUpdateDialog;
