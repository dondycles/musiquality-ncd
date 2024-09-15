"use client";
import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import {
  ArrangersPublicData,
  Library,
  Sheets,
  SheetsFileURL,
  Transactions,
} from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { getUserTransactions } from "@/app/actions";
type InitialState = {
  userData:
    | {
        sheets: typeof Sheets.$inferSelect;
        arrangers_pb_data: typeof ArrangersPublicData.$inferSelect;
        sheets_file_url: typeof SheetsFileURL.$inferSelect;
        library: typeof Library.$inferSelect;
        transactions: typeof Transactions.$inferSelect;
      }[]
    | null;
  isLoading: boolean;
};

const initialState: InitialState = { userData: null, isLoading: true };
export const UserDataContext = createContext<InitialState>(initialState);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();

  const { data, isLoading } = useQuery({
    enabled: (user !== undefined || user !== null) && isLoaded && isSignedIn,
    queryKey: ["user-data", user?.id],
    queryFn: async () => await getUserTransactions(),
  });

  return (
    <UserDataContext.Provider
      value={{
        isLoading,
        userData: data?.success === undefined ? null : data.success,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}
