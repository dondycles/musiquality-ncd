"use client";
import { usePagePreferences } from "@/store";

export default function Orientor({
  actionType,
  col,
  row,
}: {
  actionType: "library" | "search" | "top-selling";
  col: React.ReactNode;
  row: React.ReactNode;
}) {
  const pagePreferences = usePagePreferences();

  const view =
    (actionType === "library" && pagePreferences.librarySheetsView) ||
    (actionType === "top-selling" && pagePreferences.topSellingSheetsView) ||
    (actionType === "search" && pagePreferences.searchSheetsView) ||
    "col";

  return view === "col" ? col : row;
}
