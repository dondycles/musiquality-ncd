import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { SheetData } from "./utils/db/types";
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // console.log(name, "has been retrieved");
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // console.log(name, "with value", value, "has been saved");
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    // console.log(name, "has been deleted");
    await del(name);
  },
};

type Cart = {
  cart: SheetData[];
  addToCart: (sheet: SheetData) => void;
  removeToCart: (sheet: SheetData) => void;
  resetCart: () => void;
  state: "cart" | "checkout" | "success" | "error";
  setState: (state: "cart" | "checkout" | "success" | "error") => void;
};

export const useCartStore = create<Cart>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (sheetToBeAdded) =>
        set((state) => {
          const existingItem = state.cart.find(
            (sheet) => sheet.sheets.id === sheetToBeAdded.sheets.id
          );
          if (existingItem) {
            return { cart: state.cart };
          } else return { cart: [...state.cart, sheetToBeAdded] };
        }),
      removeToCart: (sheetTobeRemoved) =>
        set((state) => {
          return {
            cart: state.cart.filter(
              (sheet) => sheet.sheets.id !== sheetTobeRemoved.sheets.id
            ),
          };
        }),
      resetCart: () =>
        set(() => {
          return { cart: [] };
        }),
      state: "cart",
      setState: (state) => set(() => ({ state })),
    }),
    { name: "cart", storage: createJSONStorage(() => storage) }
  )
);
export type View = "row" | "col";
type PagePreferences = {
  topSellingSheetsView: View;
  setTopSellingSheetsView: () => void;
  topArrangersView: View;
  setTopArrangersView: () => void;
  librarySheetsView: View;
  setLibrarySheetsView: () => void;
  searchSheetsView: View;
  setSearchSheetsView: () => void;
};

export const usePagePreferences = create<PagePreferences>()(
  persist(
    (set) => ({
      topSellingSheetsView: "col",
      setTopSellingSheetsView: () =>
        set((state) => {
          return {
            topSellingSheetsView:
              state.topSellingSheetsView === "col" ? "row" : "col",
          };
        }),
      topArrangersView: "col",
      setTopArrangersView: () =>
        set((state) => {
          return {
            topArrangersView: state.topArrangersView === "col" ? "row" : "col",
          };
        }),
      librarySheetsView: "col",
      setLibrarySheetsView: () =>
        set((state) => {
          return {
            librarySheetsView:
              state.librarySheetsView === "col" ? "row" : "col",
          };
        }),
      searchSheetsView: "col",
      setSearchSheetsView: () =>
        set((state) => {
          return {
            searchSheetsView: state.searchSheetsView === "col" ? "row" : "col",
          };
        }),
    }),
    {
      name: "page-preferences",
    }
  )
);

type ArrangerCenterPageState = {
  view: "new" | "sales" | "profile";
  setView: (view: "new" | "sales" | "profile") => void;
};

export const useArrangerCenterPageState = create<ArrangerCenterPageState>()(
  persist(
    (set) => ({
      view: "new",
      setView: (view) => set(() => ({ view })),
    }),
    { name: "arranger-center-page-state" }
  )
);
