import SearchBar from "@/components/search-bar";
import { db } from "../db";
import { Sheets } from "../db/schema";
import { ilike } from "drizzle-orm";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const res = await db
    .select()
    .from(Sheets)
    .where(ilike(Sheets.title, `%${searchParams.term}%`));
  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
      <SearchBar />
      <p className="text-muted-foreground">
        Search results for: {searchParams.term}
      </p>
      <div className="flex flex-col gap-2">
        {res.map((sheet) => (
          <div key={sheet.id}>{sheet.title}</div>
        ))}
      </div>
    </div>
  );
}
