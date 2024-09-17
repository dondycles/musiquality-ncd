import { X } from "lucide-react";
import SheetThumbnail from "../sheets/sheet-thumbnail";
import { Button } from "../ui/button";
import CurrencyText from "../currency-text";
import { SheetData } from "@/utils/db/types";

export default function CartItem({
  remove,
  sheet,
}: {
  remove: () => void;
  sheet: SheetData;
}) {
  return (
    <div
      key={sheet.sheets.id}
      className="flex flex-row gap-1 bg-muted rounded-md"
    >
      <SheetThumbnail
        className="shrink-0 w-24 sm-w-20 rounded-md border overflow-hidden"
        existingThumbnailUrl={sheet.sheets.thumbnail_url}
      />
      <div className="flex flex-col p-1 flex-1">
        <p>{sheet.sheets.title}</p>
        <p className="text-muted-foreground text-xs  line-clamp-1">
          {sheet.arrangers_pb_data?.name}
        </p>
        <CurrencyText
          className="mb-0 mt-auto"
          branded={false}
          amount={sheet.sheets.price}
        />
      </div>
      <Button
        onClick={remove}
        className="shrink-0 my-auto mr-1"
        size={"icon"}
        variant={"ghost"}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
