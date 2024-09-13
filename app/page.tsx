import SearchBar from "@/components/search-bar";
import { Suspense } from "react";
import { ArrangersPublicData, Sheets } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import SheetThumbnail from "@/components/sheet.thumnail";

export default async function Home() {
  const sheets = await db
    .select()
    .from(Sheets)
    .innerJoin(
      ArrangersPublicData,
      eq(Sheets.arranger_id, ArrangersPublicData.id)
    )
    .limit(10);

  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding ">
      <Suspense>
        <SearchBar />
      </Suspense>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mx-auto text-center max-w-[500px]">
        {sheets.map((sheet) => (
          <div
            key={sheet.sheets.id}
            className="border rounded-md flex flex-col overflow-hidden"
          >
            <SheetThumbnail
              className="w-full"
              existingThumbnailUrl={sheet.sheets.thumbnail_url}
            />
            <div className="p-4 text-left mb-0 mt-auto">
              <p className="font-semibold text-xl truncate">
                {sheet.sheets.title}
              </p>
              <div className="text-muted-foreground text-xs">
                <p className="truncate">
                  Arranged by {sheet.arrangers_pb_data.name}
                </p>
                <p className="truncate">
                  Genres: {sheet.sheets.genres?.join(", ") ?? "None"}
                </p>
                <p className="truncate">
                  Difficulty: {sheet.sheets.difficulty}
                </p>
                <p className="truncate">
                  Instruments:{" "}
                  {sheet.sheets.instruments_used?.join(", ") ?? "None"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
