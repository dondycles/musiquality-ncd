"use client";
import { Columns3, Rows3 } from "lucide-react";
import { usePagePreferences, View } from "@/store";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export default function PageViewToggleBtn({
  className,
  actionType,
}: {
  actionType: "library" | "search" | "top-selling";
  className?: ClassNameValue;
}) {
  const pagePreferences = usePagePreferences();

  const view =
    (actionType === "library" && pagePreferences.librarySheetsView) ||
    (actionType === "top-selling" && pagePreferences.topSellingSheetsView) ||
    (actionType === "search" && pagePreferences.searchSheetsView) ||
    "col";

  const handleAction = () => {
    // Implement the action based on actionType
    if (actionType === "library") {
      pagePreferences.setLibrarySheetsView();
    }
    if (actionType === "top-selling") {
      pagePreferences.setTopSellingSheetsView();
    }
    if (actionType === "search") {
      pagePreferences.setSearchSheetsView();
    }
    // Add other action types as needed
  };

  return (
    <Button
      onClick={handleAction}
      size={"icon"}
      variant={"ghost"}
      className={cn("", className)}
    >
      {view === "col" && (
        <motion.div
          key={"col"}
          initial={{ rotate: 90, scale: 0.75 }}
          animate={{ rotate: 0, scale: 1 }}
          exit={{ rotate: -90, scale: 0.75 }}
        >
          <Rows3 size={16} />
        </motion.div>
      )}

      {view === "row" && (
        <motion.div
          key={"row"}
          initial={{ rotate: 90, scale: 0.75 }}
          animate={{ rotate: 0, scale: 1 }}
          exit={{ rotate: -90, scale: 0.75 }}
        >
          <Columns3 size={16} />
        </motion.div>
      )}
    </Button>
  );
}
