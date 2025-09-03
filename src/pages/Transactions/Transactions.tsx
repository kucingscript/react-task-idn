import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "@/components/TransactionDataTable/TransactionDataTable";
import type { Transaction } from "@/types/transaction";
import { getTransactions } from "@/lib/transactionService";
import { useDataTable } from "@/hooks/use-data-table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

const Transactions = () => {
  const {
    data,
    pageInfo,
    loading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
  } = useDataTable<Transaction>(getTransactions, "Failed to fetch rooms.");

  if (error && data.length === 0) {
    return (
      <div className="p-4 lg:p-6 text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">In Transaction</h1>
        <div className="flex gap-2 flex-col md:flex-row">
          <Input
            placeholder="Search by code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:max-w-sm"
          />
          <Link to="/admin/transactions/create">
            <Button className="w-full md:w-auto cursor-pointer">
              <IconPlus className="mr-2 h-4 w-4" /> Create Transaction
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pageInfo={pageInfo}
          currentPage={page}
          onPageChange={setPage}
          getRowId={(row) => row.in_transaction_id}
        />
      )}
    </div>
  );
};

export default Transactions;
