import Link from "next/link";
import ArrangerAvatar from "../arranger.avatar";
import CartAddButton from "../cart/cart-add-button";
import { SheetData } from "@/utils/db/types";
import { Button } from "../ui/button";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

export default function SheetBar({
  className,
  sheet,
}: {
  className?: ClassNameValue;
  sheet: SheetData;
}) {
  return (
    <div
      className={cn("col-span-1 row-span-1 flex items-center gap-2", className)}
    >
      <ArrangerAvatar size={48} arranger_data={sheet.arrangers_pb_data} />
      <div className="grid">
        <Link
          className="truncate text-sm hover:underline hover:brightness-50 duration-300"
          href={`/sheet/${sheet.sheets.id}`}
        >
          {sheet.sheets.title}
        </Link>
        <p className="text-muted-foreground text-xs">
          {sheet.sheets.og_artists.join(", ")}
        </p>
      </div>
      {!sheet.sheets_file_url ? (
        <CartAddButton
          branded={false}
          containerClassName="w-fit my-auto ml-auto mr-0"
          textClassName="text-sm sm:text-sm md:text-base"
          key={sheet.sheets.id}
          sheet={sheet}
        />
      ) : (
        <Link className="ml-auto mr-0" href={sheet.sheets_file_url.url}>
          <Button>Download</Button>
        </Link>
      )}
    </div>
  );
}
