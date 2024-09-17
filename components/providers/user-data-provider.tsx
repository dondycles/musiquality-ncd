"use client";
import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  ArrangersPublicData,
  Library,
  Sales,
  Sheets,
  SheetsFileURL,
  Transactions,
} from "@/utils/db/schema";
import { getUserWholeData } from "@/app/actions";
import { UserResource } from "@clerk/types";

export type Transaction = {
  sheets: typeof Sheets.$inferSelect;
  arrangers_pb_data: typeof ArrangersPublicData.$inferSelect;
  sheets_file_url: typeof SheetsFileURL.$inferSelect;
  library: typeof Library.$inferSelect;
  transactions: typeof Transactions.$inferSelect;
};

export type Sale = {
  sheets: typeof Sheets.$inferSelect;
  arrangers_pb_data: typeof ArrangersPublicData.$inferSelect;
  sales: typeof Sales.$inferSelect;
};

export type InitialState = {
  transactions: Transaction[] | null;
  isLoading: boolean;
  resource: UserResource | null;
  arrangerData: {
    sales: Sale[] | null;
    arrangements: (typeof Sheets.$inferSelect)[] | null;
    arrangerData: typeof ArrangersPublicData.$inferSelect | null;
  } | null;
};

const initialState: InitialState = {
  transactions: null,
  isLoading: true,
  resource: null,
  arrangerData: null,
};
export const UserDataContext = createContext<InitialState>(initialState);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();

  const { data, isLoading } = useQuery({
    enabled: (user !== undefined || user !== null) && isLoaded && isSignedIn,
    queryKey: ["user-data", user?.id],
    queryFn: async () => await getUserWholeData(),
  });

  return (
    <UserDataContext.Provider
      value={{
        isLoading: isLoading || !isLoaded,
        transactions: data?.success?.transactions.success ?? null,
        resource: user === undefined || user === null ? null : user,
        arrangerData:
          data?.success === undefined
            ? null
            : {
                sales: data.success.sales.success ?? null,
                arrangements: data.success.arrangements.success ?? null,
                arrangerData: data.success.arrangerData.success ?? null,
              },
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}
