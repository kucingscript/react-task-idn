import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "../ui/label";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  errors: FieldErrors<T>;
  placeholder?: string;
  disabled?: boolean;
}

export const FormSelect = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  errors,
  placeholder,
  disabled = false,
}: FormSelectProps<T>) => {
  const error = errors[name];

  return (
    <div>
      <Label className="mb-1" htmlFor={name}>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message?.toString()}</p>
      )}
    </div>
  );
};
