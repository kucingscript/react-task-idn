import FormInput from "@/components/FormInput/FormInput";
import { FormSelect } from "@/components/FormSelect/FormSelect";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { getItems } from "@/lib/itemService";
import { createTransaction } from "@/lib/transactionService";
import { useAuthStore } from "@/store/auth";
import type { Item } from "@/types/item";
import type { CreateTransactionPayload } from "@/types/transaction";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object().shape({
  wash_type: yup.string().required("Wash Type is required"),
  infectious_type: yup
    .string()
    .oneOf(["NON_INFECTIOUS", "INFECTIOUS"])
    .required("Infectious Type is required"),
  total_weight: yup.number().min(0).default(0).min(0),
  total_weight_scales: yup.number().min(0).default(0).min(0),
  details: yup
    .array()
    .of(yup.object().shape({ item_id: yup.string().required() }))
    .min(1, "At least one item must be added")
    .required("At least one item must be added"),
});

type FormData = Omit<CreateTransactionPayload, "corporate_id" | "total_qty">;

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
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      wash_type: "NORMAL",
      infectious_type: "NON_INFECTIOUS",
      total_weight: 0,
      total_weight_scales: 0,
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
        const itemsInfoRes = await getItems({ status: "REGISTERED", limit: 1 });
        const totalItems = itemsInfoRes.pageInfo?.total_data ?? 0;

        if (totalItems > 0) {
          const itemsRes = await getItems({
            status: "REGISTERED",
            limit: totalItems,
          });
          if (itemsRes.code === 0) setAllItems(itemsRes.data);
        }
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
    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const payload: CreateTransactionPayload = {
      ...data,
      corporate_id: user.corporates.corporate_id,
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
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Create In Transaction</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormSelect
            control={control}
            name="wash_type"
            label="Wash Type"
            options={[{ value: "NORMAL", label: "Normal" }]}
            errors={errors}
            disabled
          />
          <FormSelect
            control={control}
            name="infectious_type"
            label="Infectious Type"
            options={[
              { value: "NON_INFECTIOUS", label: "Non-Infectious" },
              { value: "INFECTIOUS", label: "Infectious" },
            ]}
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormInput<FormData>
            name="total_weight"
            type="number"
            label="Total Weight"
            register={register}
            error={errors}
            step="0.1"
          />
          <FormInput<FormData>
            name="total_weight_scales"
            type="number"
            label="Total Weight Scales"
            register={register}
            error={errors}
            step="0.1"
          />
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
            {fields.map((field, index) => {
              const item = allItems.find((i) => i.item_id === field.item_id);
              return (
                <div
                  key={field.id}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span className="font-mono text-sm">
                    {item
                      ? `${item.item_id} - ${item.item_types.name}`
                      : field.item_id}
                  </span>
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
              );
            })}
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

export default CreateTransaction;
