import { columns } from "@/components/ItemTypesDataTable/ItemTypesDataTable";
import { ResourcePage } from "@/components/ResourcePage/ResourcePage";
import { getItemTypes } from "@/lib/ItemTypesService";
import type { ItemType } from "@/types/item-types";

const ItemTypes = () => {
  return (
    <ResourcePage<ItemType>
      title="Item Types"
      fetcher={getItemTypes}
      columns={columns}
      getRowId={(row) => row.item_type_id}
      searchPlaceholder="Search by name..."
    />
  );
};

export default ItemTypes;
