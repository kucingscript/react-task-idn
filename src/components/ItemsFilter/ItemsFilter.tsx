import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import type { ItemStatus } from "@/types/item";
import type { ItemType } from "@/types/item-types";
import type { Room } from "@/types/room";
import FilterSelect from "../FilterSelect/FilterSelect";
import { Link } from "react-router-dom";

const itemStatuses: ItemStatus[] = [
  "REGISTERED",
  "WASH",
  "CLEAN",
  "STORED",
  "SENT",
  "USED",
  "DIRT",
  "DEFECT",
];

interface ItemFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedItemType: string;
  setSelectedItemType: (value: string) => void;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  itemTypes: ItemType[];
  rooms: Room[];
}

const ItemsFilter = (props: ItemFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-2 w-full max-w-full md:max-w-3xl">
      <Input
        placeholder="Search ID..."
        value={props.searchTerm}
        onChange={(e) => props.setSearchTerm(e.target.value)}
        className="w-full sm:w-auto"
      />

      <FilterSelect
        value={props.selectedItemType}
        onValueChange={props.setSelectedItemType}
        placeholder="All Item Types"
        allValueOptions="all-types"
        options={props.itemTypes.map((it) => ({
          label: it.name,
          value: it.item_type_id,
        }))}
      />

      <FilterSelect
        value={props.selectedRoom}
        onValueChange={props.setSelectedRoom}
        placeholder="All Rooms"
        allValueOptions="all-rooms"
        options={props.rooms.map((room) => ({
          label: room.name,
          value: room.room_id,
        }))}
      />

      <FilterSelect
        value={props.selectedStatus}
        onValueChange={props.setSelectedStatus}
        placeholder="All Statuses"
        allValueOptions="all-statuses"
        options={itemStatuses.map((status) => ({
          label: status,
          value: status,
        }))}
      />

      <Button asChild>
        <Link to="/admin/items/create">
          <IconPlus className="mr-2 h-4 w-4" /> Create Item
        </Link>
      </Button>
    </div>
  );
};

export default ItemsFilter;
