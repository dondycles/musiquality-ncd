"use client";

import { SheetData } from "@/utils/db/types";
import { useCartStore } from "@/store";
import { Button } from "./ui/button";
import { Pencil, ShoppingCart, X } from "lucide-react";
import CurrencyText from "./currency-text";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { UserDataContext } from "./user-data-provider";
import { useContext } from "react";
import Link from "next/link";

export default function CartAddButton({
  sheet,
  containerClassName,
  textClassName,
  branded,
}: {
  sheet: SheetData;
  containerClassName?: ClassNameValue;
  textClassName?: ClassNameValue;
  branded?: boolean;
}) {
  const { addToCart, cart, removeToCart } = useCartStore();
  const { isLoading, transactions, resource } = useContext(UserDataContext);
  const isInCart = cart.find((item) => item.sheets.id === sheet.sheets.id);
  const isPurchased = Boolean(
    transactions?.find((item) => item.sheets.id === sheet.sheets.id)
  );
  const isMyArrangement = Boolean(sheet.arrangers_pb_data.id === resource?.id);

  return (
    <div
      className={cn(
        `mt-auto mb-0 flex flex-row gap-4 justify-between items-center w-full `,
        containerClassName
      )}
    >
      {isMyArrangement ? (
        <p className="text-muted-foreground text-xs">Arranger</p>
      ) : isPurchased ? (
        <Link
          href={`/library?term=${sheet.sheets.title}`}
          className="text-muted-foreground text-xs hover:text-foreground hover:underline"
        >
          Purchased
        </Link>
      ) : (
        <CurrencyText
          branded={branded}
          className={cn("flex-1 w-full", textClassName)}
          amount={sheet.sheets.price}
        />
      )}
      {isMyArrangement ? (
        <Link href={`/arranger-center?view=edit&sheet_id=${sheet.sheets.id}`}>
          <Button
            disabled={isLoading}
            onClick={() => removeToCart(sheet)}
            variant="default"
            size="icon"
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <Pencil size={16} />
          </Button>
        </Link>
      ) : isInCart ? (
        <Button
          disabled={isLoading || isPurchased}
          onClick={() => removeToCart(sheet)}
          variant="default"
          size="icon"
        >
          <X size={10} />
          <ShoppingCart size={14} />
        </Button>
      ) : (
        <Button
          disabled={isLoading || isPurchased}
          onClick={() => addToCart(sheet)}
          variant="ghost"
          size="icon"
        >
          <ShoppingCart size={16} />
        </Button>
      )}
    </div>
  );
}
