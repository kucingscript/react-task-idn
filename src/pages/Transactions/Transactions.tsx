import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "@/components/TransactionDataTable/TransactionDataTable";
import type { Transaction } from "@/types/transaction";
import { getTransactions } from "@/lib/transactionService";
import { useDataTable } from "@/hooks/use-data-table";

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
        <Input
          placeholder="Search by code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-sm"
        />
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
