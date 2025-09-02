import type {
  FieldError,
  FieldErrors,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormInputTypes<T extends Record<string, any>> {
  type: "text" | "email" | "password";
  placeholder?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  error: FieldErrors<T>;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  labelRequired?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormInput = <T extends Record<string, any>>(props: FormInputTypes<T>) => {
  const fieldError = props.error[props.name] as FieldError | undefined;

  return (
    <div>
      {props.label && <Label htmlFor={props.name}>{props.label}</Label>}

      <Input
        id={props.name}
        type={props.type}
        className="mt-1"
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        {...props.register(props.name)}
      />

      {fieldError && (
        <small className="text-sm font-medium text-red-500">
          {fieldError.message}
        </small>
      )}
    </div>
  );
};

export default FormInput;
