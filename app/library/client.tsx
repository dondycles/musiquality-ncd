"use client";
import { UserDataContext } from "@/components/user-data-provider";
import { useContext } from "react";
import { Music } from "lucide-react";
import {
  SheetsDisplayer,
  SheetsDisplayerContent,
  SheetsDisplayerHeader,
  SheetsDisplayerIcon,
  SheetsDisplayerTitle,
  SheetsDisplayerViewToggleBtn,
} from "@/components/sheets/sheets-displayer";
export default function LibraryClientPage() {
  const { userData, isLoading } = useContext(UserDataContext);
  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {userData ? (
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
                  sheets={userData.map((data) => ({
                    arrangers_pb_data: data.arrangers_pb_data,
                    sheets: data.sheets,
                    sheets_file_url: data.sheets_file_url,
                  }))}
                />
              </SheetsDisplayer>
              <p className="text-muted-foreground">Transactions</p>

              {Array.from(
                new Set(
                  userData.map((data) => data.transactions.payment_intent_id)
                )
              ).map((paymentIntentId) => {
                const transaction = userData.find(
                  (data) =>
                    data.transactions.payment_intent_id === paymentIntentId
                )?.transactions;
                if (!transaction) return null;
                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col gap-4 rounded-md bg-muted p-4"
                  >
                    <p className="text-xs text-muted-foreground">
                      {transaction.payment_intent_id}
                    </p>
                    <p>{JSON.stringify(transaction.metadata)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            "No transactions"
          )}
        </div>
      )}
    </div>
  );
}
