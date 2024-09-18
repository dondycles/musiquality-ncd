"use client";
import { UserDataContext } from "@/components/providers/user-data-provider";
import { Suspense, useContext } from "react";
import { Loader, Music } from "lucide-react";
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
import { SheetData } from "@/utils/db/types";
export default function LibraryClientPage({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const { userTransactions, isLoading } = useContext(UserDataContext);

  const uniqueTransactions = Array.from(
    new Set(userTransactions?.map((trans) => trans.payment_intent_id))
  ).map((paymentIntentId) => {
    const transaction = userTransactions?.find(
      (trans) => trans.payment_intent_id === paymentIntentId
    );
    return transaction;
  });
  const library = userTransactions?.flatMap((trans) => trans.library);

  const sheets = library
    ?.filter(
      (lib) =>
        lib.sheet?.title
          .toLowerCase()
          .includes(searchParams.term?.toLowerCase() ?? "") ||
        lib.sheet?.arranger?.name
          .toLowerCase()
          .includes(searchParams.term?.toLowerCase() ?? "") ||
        lib.sheet?.og_artists.some((artist) =>
          artist.toLowerCase().includes(searchParams.term?.toLowerCase() ?? "")
        ) ||
        lib.sheet?.id.toString().includes(searchParams.term ?? "")
    )
    .map(
      (data) =>
        ({
          arrangers_pb_data: data.sheet?.arranger,
          sheets: data.sheet,
          sheets_file_url: data.sheet?.fileUrl,
        } as SheetData)
    );

  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
      <Suspense>
        <SearchBar baseUrl="/library" />
      </Suspense>
      {isLoading ? (
        <div>
          <Loader size={16} className="animate-spin mx-auto" />
        </div>
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
              sheets={sheets ?? []}
            />
          </SheetsDisplayer>
          <DataTable
            columns={transactionColumns}
            data={uniqueTransactions?.toSorted(
              (a, b) => b!.created_at.getTime() - a!.created_at.getTime()
            )}
          />
        </div>
      )}
    </div>
  );
}
