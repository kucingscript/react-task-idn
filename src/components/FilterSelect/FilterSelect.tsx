import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Option[];
  allValueOptions: string;
}

const FilterSelect = (props: FilterSelectProps) => {
  return (
    <Select
      value={props.value}
      onValueChange={(val) =>
        props.onValueChange(val === props.allValueOptions ? "" : val)
      }
    >
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={props.allValueOptions}>
          {props.placeholder}
        </SelectItem>
        {props.options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="capitalize"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;
