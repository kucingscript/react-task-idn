import { DatePicker } from "@/components/DatePicker/DatePicker";
import { FormSelect } from "@/components/FormSelect/FormSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createItem, getItemById } from "@/lib/itemService";
import { getItemTypes } from "@/lib/ItemTypesService";
import { getRooms } from "@/lib/roomService";
import { useAuthStore } from "@/store/auth";
import type { CreateItemPayload } from "@/types/item";
import type { ItemType } from "@/types/item-types";
import type { Room } from "@/types/room";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object().shape({
  item_type_id: yup.string().required("Item Type is required"),
  room_id: yup.string().required("Room is required"),
  procurement_date: yup.date().required("Procurement Date is required"),
  details: yup
    .array()
    .of(
      yup.object().shape({
        item_id: yup
          .string()
          .min(10, "Item ID must be at least 10 characters")
          .required("Item ID is required"),
      })
    )
    .min(1, "At least one item must be added")
    .required(),
});

type FormData = Omit<
  CreateItemPayload,
  "corporate_id" | "total_qty" | "reff_id" | "procurement_date"
> & { procurement_date: Date };

const CreateItem = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [currentItemId, setCurrentItemId] = useState("");

  const [itemIdError, setItemIdError] = useState<string | null>(null);
  const [isCheckingId, setIsCheckingId] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      details: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [roomsInfoRes, itemTypesInfoRes] = await Promise.all([
          getRooms({ limit: 1 }),
          getItemTypes({ limit: 1 }),
        ]);

        const totalRooms = roomsInfoRes.pageInfo?.total_data ?? 0;
        const totalItemTypes = itemTypesInfoRes.pageInfo?.total_data ?? 0;

        const [roomsRes, itemTypesRes] = await Promise.all([
          totalRooms > 0
            ? getRooms({ limit: totalRooms })
            : Promise.resolve(null),
          totalItemTypes > 0
            ? getItemTypes({ limit: totalItemTypes })
            : Promise.resolve(null),
        ]);

        if (roomsRes && roomsRes.code === 0) {
          setRooms(roomsRes.data);
        }
        if (itemTypesRes && itemTypesRes.code === 0) {
          setItemTypes(itemTypesRes.data);
        }
      } catch (error) {
        toast.error("Failed to fetch initial data.");
        console.error(error);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddItem = async () => {
    const trimmedId = currentItemId.trim();

    setItemIdError(null);

    if (trimmedId.length < 10) {
      setItemIdError("Item ID must be at least 10 characters.");
      return;
    }

    const currentDetails = getValues("details") || [];
    if (currentDetails.some((field) => field.item_id === trimmedId)) {
      setItemIdError("Item ID already exists in the list.");
      return;
    }

    setIsCheckingId(true);
    try {
      await getItemById(trimmedId);
      setItemIdError("Item ID already exists in the database.");
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        append({ item_id: trimmedId });
        setCurrentItemId("");
      } else {
        toast.error("Error verifying Item ID. Please try again.");
      }
    } finally {
      setIsCheckingId(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const payload: CreateItemPayload = {
      ...data,
      corporate_id: user.corporates.corporate_id,
      procurement_date: data.procurement_date.toISOString(),
      total_qty: data.details.length,
      reff_id: "",
      details: data.details,
    };

    try {
      await createItem(payload);
      toast.success("Items created successfully!");
      navigate("/admin/items");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create items.");
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Batch Create Items</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormSelect
            control={control}
            name="item_type_id"
            label="Item Type"
            options={itemTypes.map((it) => ({
              value: it.item_type_id,
              label: it.name,
            }))}
            errors={errors}
            placeholder="Select Item Type"
          />
          <FormSelect
            control={control}
            name="room_id"
            label="Room"
            options={rooms.map((room) => ({
              value: room.room_id,
              label: room.name,
            }))}
            errors={errors}
            placeholder="Select Room"
          />
          <div>
            <Label className="mb-1" htmlFor="procurement_date">
              Procurement Date
            </Label>
            <Controller
              control={control}
              name="procurement_date"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.procurement_date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.procurement_date.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="font-semibold">
            Item Details (Total: {fields.length})
          </h2>
          <div className="flex gap-2">
            <div className="flex-grow">
              <Input
                placeholder="Enter Item ID (min. 10 characters)"
                value={currentItemId}
                onChange={(e) => {
                  setCurrentItemId(e.target.value);
                  if (itemIdError) {
                    setItemIdError(null);
                  }
                }}
              />
              {itemIdError && (
                <p className="text-red-500 text-xs mt-1">{itemIdError}</p>
              )}
            </div>
            <Button
              type="button"
              onClick={handleAddItem}
              disabled={isCheckingId}
            >
              <IconPlus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>

          {errors.details && (
            <p className="text-sm text-red-500">{errors.details.message}</p>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <span className="font-mono text-sm">{field.item_id}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={() => remove(index)}
                >
                  <IconTrash size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit Transaction"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateItem;
