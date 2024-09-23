"use client";
import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { getUserWholeData } from "@/app/actions";
import { UserResource } from "@clerk/types";
import {
  CurrentArrangerData,
  CurrentUserFollowings,
  CurrentUserTransactions,
} from "@/utils/db/infer-types";

export type InitialState = {
  userTransactions: CurrentUserTransactions[] | null;
  isLoading: boolean;
  resource: UserResource | null;
  arrangerData: CurrentArrangerData | null;
  userFollowings: CurrentUserFollowings[] | null;
};

const initialState: InitialState = {
  userTransactions: null,
  isLoading: true,
  resource: null,
  arrangerData: null,
  userFollowings: null,
};
export const UserDataContext = createContext<InitialState>(initialState);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();

  const { data, isFetching } = useQuery({
    enabled: (user !== undefined || user !== null) && isLoaded && isSignedIn,
    queryKey: ["user-data", user?.id],
    queryFn: async () => await getUserWholeData(user?.id ?? null),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <UserDataContext.Provider
      value={{
        isLoading: isFetching || !isLoaded,
        userTransactions: data?.userTransactions ?? null,
        resource: user === undefined || user === null ? null : user,
        arrangerData: data?.arrangerData ?? null,
        userFollowings: data?.userFollowings ?? null,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}
