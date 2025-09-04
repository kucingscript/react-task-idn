import { columns } from "@/components/TransactionDataTable/TransactionDataTable";
import { ResourcePage } from "@/components/ResourcePage/ResourcePage";
import { getTransactions } from "@/lib/transactionService";
import type { Transaction } from "@/types/transaction";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

const Transactions = () => {
  const createButton = (
    <Link to="/admin/transactions/create">
      <Button className="w-full md:w-auto cursor-pointer">
        <IconPlus className="mr-2 h-4 w-4" /> Create Transaction
      </Button>
    </Link>
  );

  return (
    <ResourcePage<Transaction>
      title="In Transaction"
      fetcher={getTransactions}
      columns={columns}
      getRowId={(row) => row.in_transaction_id}
      searchPlaceholder="Search by code..."
      actionButtons={createButton}
    />
  );
};

export default Transactions;
