"use client";
import { usePagePreferences } from "@/store";
import React from "react";

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

  return view === "col" ? (
    <React.Fragment key={`${actionType}-col`}>{col}</React.Fragment>
  ) : (
    <React.Fragment key={`${actionType}-row`}>{row}</React.Fragment>
  );
}
