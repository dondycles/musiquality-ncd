import SearchBar from "@/components/search-bar";
import { db } from "../db";
import { ArrangersPublicData, Sheets } from "../db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const res = await db
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
      <SearchBar />
      <p className="text-muted-foreground">
        Search results for: {searchParams.term}
      </p>
      <div className="flex flex-col gap-2">
        {res.map((sheet) => (
          <div key={sheet.sheets.id}>{sheet.sheets.title}</div>
        ))}
      </div>
    </div>
  );
}
