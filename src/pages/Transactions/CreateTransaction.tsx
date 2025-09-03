import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getItems } from "@/lib/itemService";
import { createTransaction } from "@/lib/transactionService";
import { useAuthStore } from "@/store/auth";
import type { Item } from "@/types/item";
import type { CreateTransactionRequest } from "@/types/transaction";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object().shape({
  wash_type: yup.string().required("Wash Type is required"),
  infectious_type: yup
    .string()
    .oneOf(["NON_INFECTIOUS", "INFECTIOUS"])
    .required("Infectious Type is required"),
  total_weight: yup.number().min(0).default(0),
  total_weight_scales: yup.number().min(0).default(0),
  corporate_id: yup.string().required(),
  details: yup
    .array()
    .of(yup.object().shape({ item_id: yup.string().required() }))
    .min(1, "At least one item must be added"),
});

type FormData = yup.InferType<typeof schema>;

const CreateTransaction = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      wash_type: "NORMAL",
      infectious_type: "NON_INFECTIOUS",
      total_weight: 0,
      total_weight_scales: 0,
      corporate_id: user?.corporates.corporate_id || "",
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
        const itemsRes = await getItems({ status: "REGISTERED", limit: 1000 });
        if (itemsRes.code === 0) setAllItems(itemsRes.data);
      } catch (error) {
        toast.error("Failed to fetch initial data.");
        console.error(error);
      }
    };
    fetchInitialData();
  }, []);

  const unselectedItemOptions = allItems
    .filter((item) => !fields.some((field) => field.item_id === item.item_id))
    .map((item) => ({
      value: item.item_id,
      label: `${item.item_id} - ${item.item_types.name}`,
    }));

  const handleAddItem = () => {
    if (selectedItemId) {
      append({ item_id: selectedItemId });
      setSelectedItemId("");
    } else {
      toast.info("Please select an item from the list.");
    }
  };

  const onSubmit = async (data: FormData) => {
    const payload: CreateTransactionRequest = {
      ...data,
      total_qty: data.details.length,
    };

    try {
      await createTransaction(payload);
      toast.success("Transaction created successfully!");
      navigate("/admin/transactions");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create transaction."
      );
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Create In Transaction</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Wash Type</Label>
            <Controller
              name="wash_type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue="NORMAL"
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Infectious Type</Label>
            <Controller
              name="infectious_type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NON_INFECTIOUS">
                      Non-Infectious
                    </SelectItem>
                    <SelectItem value="INFECTIOUS">Infectious</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="total_weight">Total Weight</Label>
            <Input
              id="total_weight"
              type="number"
              step="0.1"
              {...register("total_weight")}
            />
          </div>
          <div>
            <Label htmlFor="total_weight_scales">Total Weight Scales</Label>
            <Input
              id="total_weight_scales"
              type="number"
              step="0.1"
              {...register("total_weight_scales")}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="font-semibold">Items (Total: {fields.length})</h2>
          <div className="flex gap-2">
            <div className="flex-grow">
              <Combobox
                options={unselectedItemOptions}
                value={selectedItemId}
                onChange={setSelectedItemId}
                placeholder="Select an item to add..."
                searchPlaceholder="Search Item ID or Name..."
                emptyText="No available items found."
              />
            </div>
            <Button type="button" onClick={handleAddItem}>
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
                  className="h-8 w-8 text-red-500 hover:text-red-600"
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
            {isSubmitting ? "Submitting..." : "Submit Transaction"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTransaction;
