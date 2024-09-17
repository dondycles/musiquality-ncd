import ArrangerAvatar from "@/components/arranger.avatar";
import BrandedText from "@/components/branded-text";
import CartAddButton from "@/components/cart/cart-add-button";
import SheetCard from "@/components/sheets/sheet-card";
import SheetThumbnail from "@/components/sheets/sheet-thumbnail";
import { Separator } from "@/components/ui/separator";
import { db } from "@/utils/db";
import { ArrangersPublicData, Sheets, SheetsFileURL } from "@/utils/db/schema";
import { SheetData } from "@/utils/db/types";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function SheetPage({
  params,
}: {
  params: { id: number };
}) {
  const sheet = await db
    .select()
    .from(Sheets)
    .where(eq(Sheets.id, params.id))
    .innerJoin(
      ArrangersPublicData,
      eq(Sheets.arranger_id, ArrangersPublicData.id)
    )
    .limit(1);

  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-4">
          <SheetThumbnail
            className="border rounded-md overflow-hidden mx-auto sm:mx-0"
            existingThumbnailUrl={sheet[0].sheets.thumbnail_url}
          />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <BrandedText useH1={true} text={sheet[0].sheets.title} />
              <p className="text-muted-foreground text-xs">
                {sheet[0].sheets.og_artists.join(", ")}
              </p>
            </div>
            <div className="space-y-2">
              <Separator className="mt-1" />
              <div className="flex flex-col gap-1 text-muted-foreground w-fit border rounded-md p-2">
                <p className="text-xs">Arranged by</p>
                <div className="flex items-center gap-1">
                  <ArrangerAvatar
                    size={32}
                    arranger_data={sheet[0].arrangers_pb_data}
                  />
                  <Link
                    className="truncate"
                    href={`/arranger/${sheet[0].arrangers_pb_data.slug}`}
                  >
                    {sheet[0].arrangers_pb_data.name}
                  </Link>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">
                  Difficulty: {sheet[0].sheets.difficulty}
                </p>
                <p className="text-muted-foreground">
                  Instruments:{" "}
                  {sheet[0].sheets.instruments_used?.join(", ") ?? "None"}
                </p>
                <p className="text-muted-foreground">
                  Genres: {sheet[0].sheets.genres?.join(", ") ?? "None"}
                </p>
              </div>
              <CartAddButton
                containerClassName="w-fit"
                sheet={{
                  sheets: sheet[0].sheets,
                  sheets_file_url: null,
                  arrangers_pb_data: sheet[0].arrangers_pb_data,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
