import SearchBar from "@/components/search-bar";
import { Suspense } from "react";
import { ArrangersPublicData, Sheets } from "../../utils/db/schema";
import { db } from "../../utils/db";
import { eq } from "drizzle-orm";
import { Flame } from "lucide-react";

import {
  SheetsDisplayer,
  SheetsDisplayerHeader,
  SheetsDisplayerTitle,
  SheetsDisplayerIcon,
  SheetsDisplayerContent,
  SheetsDisplayerViewToggleBtn,
} from "@/components/sheets/sheets-displayer";

export default async function Home() {
  const sheets = await db
    .select()
    .from(Sheets)
    .innerJoin(
      ArrangersPublicData,
      eq(Sheets.arranger_id, ArrangersPublicData.id)
    );

  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding ">
      <Suspense>
        <SearchBar baseUrl="/search" />
      </Suspense>
      <SheetsDisplayer>
        <SheetsDisplayerHeader>
          <SheetsDisplayerIcon>
            <Flame size={24} />
          </SheetsDisplayerIcon>
          <SheetsDisplayerTitle>Top Selling Sheets</SheetsDisplayerTitle>
          <SheetsDisplayerViewToggleBtn actionType="top-selling" />
        </SheetsDisplayerHeader>
        <SheetsDisplayerContent actionType="top-selling" sheets={sheets} />
      </SheetsDisplayer>
    </div>
  );
}
