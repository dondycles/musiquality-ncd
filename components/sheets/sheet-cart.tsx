import { PrivateSheetData, PublicSheetData } from "@/utils/db/types";
import { cn } from "@/lib/utils";
import SheetThumbnail from "./sheet-thumbnail";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ArrangerAvatar from "../arranger.avatar";
import CartAddButton from "../cart.add-button";

export default function SheetCard({
  className,
  sheet,
}: {
  className?: string;
  sheet: PublicSheetData | PrivateSheetData;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden w-[244px] flex flex-col h-full rounded-md border",
        className
      )}
    >
      <SheetThumbnail
        className="w-full"
        existingThumbnailUrl={sheet.sheets.thumbnail_url}
      />
      <div className="p-4 text-left mb-0 mt-auto bg-muted/25">
        <Link href={`/sheet/${sheet.sheets.id}`}>
          <p className="font-semibold text-xl truncate">{sheet.sheets.title}</p>
        </Link>
        <div className="text-xs space-y-2">
          <div className="flex items-center gap-1">
            <ArrangerAvatar size={24} arranger_data={sheet.arrangers_pb_data} />
            <Link href={`/arranger/${sheet.arrangers_pb_data.slug}`}>
              <p className="truncate">{sheet.arrangers_pb_data.name}</p>
            </Link>
          </div>
          <div className="text-muted-foreground">
            <p className="truncate">
              Artists: {sheet.sheets.og_artists?.join(", ") ?? "None"}
            </p>
            <p className="truncate">Difficulty: {sheet.sheets.difficulty}</p>
            <p className="truncate">
              Instruments: {sheet.sheets.instruments_used?.join(", ") ?? "None"}
            </p>
            <p className="truncate">
              Genres: {sheet.sheets.genres?.join(", ") ?? "None"}
            </p>
          </div>
          {!(sheet as PrivateSheetData).sheets_file_url ? (
            <CartAddButton sheet={sheet} />
          ) : (
            <Link
              className="w-full"
              href={(sheet as PrivateSheetData).sheets_file_url.url}
            >
              <Button className="w-full mt-2">Download</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
