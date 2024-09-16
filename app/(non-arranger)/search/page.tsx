import SearchBar from "@/components/search-bar";
import { db } from "../../../utils/db";
import { ArrangersPublicData, Sheets } from "../../../utils/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { Suspense } from "react";

import { Search } from "lucide-react";
import {
  SheetsDisplayer,
  SheetsDisplayerContent,
  SheetsDisplayerHeader,
  SheetsDisplayerIcon,
  SheetsDisplayerTitle,
  SheetsDisplayerViewToggleBtn,
} from "@/components/sheets/sheets-displayer";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const sheets = await db
    .select()
    .from(Sheets)
    .innerJoin(
      ArrangersPublicData,
      eq(Sheets.arranger_id, ArrangersPublicData.id)
    )
    .where(
      or(
        ilike(Sheets.title, `%${searchParams.term}%`),
        ilike(ArrangersPublicData.name, `%${searchParams.term}%`),
        sql`EXISTS (
          SELECT 1
          FROM unnest(${Sheets.og_artists}::text[]) AS artist
          WHERE artist ILIKE ${`%${searchParams.term}%`}
        )`
      )
    );
  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
      <h1 className="text-muted-foreground">
        Search results for: {searchParams.term}
      </h1>
      <Suspense>
        <SearchBar baseUrl="/search" />
      </Suspense>
      <SheetsDisplayer>
        <SheetsDisplayerHeader>
          <SheetsDisplayerIcon>
            <Search size={24} className="m-auto" />
          </SheetsDisplayerIcon>
          <SheetsDisplayerTitle>Search Results</SheetsDisplayerTitle>
          <SheetsDisplayerViewToggleBtn actionType="search" />
        </SheetsDisplayerHeader>
        <SheetsDisplayerContent
          actionType="search"
          sheets={sheets.map((data) => ({
            arrangers_pb_data: data.arrangers_pb_data,
            sheets: data.sheets,
            sheets_file_url: null,
          }))}
        />
      </SheetsDisplayer>
    </div>
  );
}
