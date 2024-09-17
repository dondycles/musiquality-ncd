"use client";
import { UserDataContext } from "@/components/providers/user-data-provider";
import { Suspense, useContext } from "react";
import { Music } from "lucide-react";
import {
  SheetsDisplayer,
  SheetsDisplayerContent,
  SheetsDisplayerHeader,
  SheetsDisplayerIcon,
  SheetsDisplayerTitle,
  SheetsDisplayerViewToggleBtn,
} from "@/components/sheets/sheets-displayer";
import SearchBar from "@/components/search-bar";
import { DataTable } from "./transaction-data-table";
import { transactionColumns } from "./transaction-columns";
export default function LibraryClientPage({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const { transactions, isLoading } = useContext(UserDataContext);

  const uniqueTransactions = Array.from(
    new Set(transactions?.map((data) => data.transactions.payment_intent_id))
  ).map((paymentIntentId) => {
    const transaction = transactions?.find(
      (data) => data.transactions.payment_intent_id === paymentIntentId
    )?.transactions;
    return transaction;
  });

  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
      <Suspense>
        <SearchBar baseUrl="/library" />
      </Suspense>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <SheetsDisplayer>
            <SheetsDisplayerHeader>
              <SheetsDisplayerIcon>
                <Music size={24} className="m-auto" />
              </SheetsDisplayerIcon>
              <SheetsDisplayerTitle>Purchased Sheets</SheetsDisplayerTitle>
              <SheetsDisplayerViewToggleBtn actionType="library" />
            </SheetsDisplayerHeader>
            <SheetsDisplayerContent
              actionType="library"
              sheets={
                transactions
                  ?.filter(
                    (data) =>
                      data.sheets.title
                        .toLowerCase()
                        .includes(searchParams.term?.toLowerCase()) ||
                      data.arrangers_pb_data.name
                        .toLowerCase()
                        .includes(searchParams.term?.toLowerCase()) ||
                      data.sheets.og_artists.some((artist) =>
                        artist
                          .toLowerCase()
                          .includes(searchParams.term?.toLowerCase())
                      ) ||
                      data.sheets.id
                        .toString()
                        .includes(searchParams.term ?? "")
                  )
                  .map((data) => ({
                    arrangers_pb_data: data.arrangers_pb_data,
                    sheets: data.sheets,
                    sheets_file_url: data.sheets_file_url,
                  })) ?? []
              }
            />
          </SheetsDisplayer>
          <DataTable columns={transactionColumns} data={uniqueTransactions} />
        </div>
      )}
    </div>
  );
}
