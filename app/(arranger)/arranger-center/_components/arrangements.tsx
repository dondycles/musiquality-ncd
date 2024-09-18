"use client";
import {
  SheetsDisplayer,
  SheetsDisplayerHeader,
  SheetsDisplayerTitle,
  SheetsDisplayerIcon,
  SheetsDisplayerContent,
  SheetsDisplayerViewToggleBtn,
} from "@/components/sheets/sheets-displayer";
import { Music } from "lucide-react";
import { SheetData } from "@/utils/db/types";
import { CurrentArrangerData } from "@/utils/db/infer-types";

export default function ArrangerCenterArrangements({
  sheets,
}: {
  sheets: CurrentArrangerData["sheet"];
}) {
  const arrangements =
    sheets.map(
      (s) =>
        ({
          arrangers_pb_data: s.arranger,
          sheets: s,
          sheets_file_url: s.fileUrl,
        } as SheetData)
    ) ?? [];
  return (
    <SheetsDisplayer>
      <SheetsDisplayerHeader>
        <SheetsDisplayerIcon>
          <Music size={24} />
        </SheetsDisplayerIcon>
        <SheetsDisplayerTitle>Your Arrangements</SheetsDisplayerTitle>
        <SheetsDisplayerViewToggleBtn actionType="top-selling" />
      </SheetsDisplayerHeader>
      <SheetsDisplayerContent actionType="top-selling" sheets={arrangements} />
    </SheetsDisplayer>
  );
}
