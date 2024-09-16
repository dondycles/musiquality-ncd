"use client";
import { UserDataContext } from "@/components/user-data-provider";
import { useContext } from "react";
import {
  SheetsDisplayer,
  SheetsDisplayerHeader,
  SheetsDisplayerTitle,
  SheetsDisplayerIcon,
  SheetsDisplayerContent,
  SheetsDisplayerViewToggleBtn,
} from "@/components/sheets/sheets-displayer";
import { Music } from "lucide-react";

export default function ArrangerCenterArrangements() {
  const { arrangerData, isLoading } = useContext(UserDataContext);

  if (isLoading) return <div>Loading...</div>;

  return (
    <SheetsDisplayer>
      <SheetsDisplayerHeader>
        <SheetsDisplayerIcon>
          <Music size={24} />
        </SheetsDisplayerIcon>
        <SheetsDisplayerTitle>Your Arrangements</SheetsDisplayerTitle>
        <SheetsDisplayerViewToggleBtn actionType="top-selling" />
      </SheetsDisplayerHeader>
      <SheetsDisplayerContent
        actionType="top-selling"
        sheets={
          arrangerData?.arrangements?.map((a) => ({
            sheets: a,
            arrangers_pb_data: {
              ...arrangerData.arrangerData!,
            },
          })) || []
        }
      />
    </SheetsDisplayer>
  );
}
