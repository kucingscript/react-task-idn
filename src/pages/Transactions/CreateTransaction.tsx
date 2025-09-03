import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/lib/transactionService";
import { useAuthStore } from "@/store/auth";
import type { CreateInTransactionRequest } from "@/types/transaction";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object().shape({
  wash_type: yup.string().required("Wash Type is required"),
  infectious_type: yup.string().required("Infectious Type is required"),
  total_weight: yup.number().min(0).default(0),
  total_weight_scales: yup.number().min(0).default(0),
  corporate_id: yup.string().required(),
  details: yup
    .array()
    .of(yup.object().shape({ item_id: yup.string().required() }))
    .min(1, "At least one item must be added"),
});

const CreateTransaction = () => {
  const navigate = useNavigate();
  const [newItemId, setNewItemId] = useState("");
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
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

  const detailsArray = watch("details") || [];

  const handleAddItem = () => {
    if (newItemId.trim() !== "") {
      if (fields.some((item) => item.item_id === newItemId.trim())) {
        toast.warning("Item ID already exists in the list.");
        return;
      }
      append({ item_id: newItemId.trim() });
      setNewItemId("");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const payload: CreateInTransactionRequest = {
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
            <Select
              onValueChange={(value) => setValue("wash_type", value)}
              defaultValue="NORMAL"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="INFECTED">Infected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Infectious Type</Label>
            <Select
              onValueChange={(value) => setValue("infectious_type", value)}
              defaultValue="NON_INFECTIOUS"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NON_INFECTIOUS">Non-Infectious</SelectItem>
                <SelectItem value="INFECTIOUS">Infectious</SelectItem>
              </SelectContent>
            </Select>
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
          <h2 className="font-semibold">
            Items (Total: {detailsArray.length})
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter or scan Item ID"
              value={newItemId}
              onChange={(e) => setNewItemId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
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
