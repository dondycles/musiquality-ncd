"use client";

import { PublicSheetData } from "@/app/db/types";
import { useCartStore } from "@/store";
import { Button } from "./ui/button";
import { ShoppingCart, X } from "lucide-react";
import CurrencyText from "./currency-text";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

export default function CartAddButton({
  sheet,
  containerClassName,
  textClassName,
  branded,
}: {
  sheet: PublicSheetData;
  containerClassName?: ClassNameValue;
  textClassName?: ClassNameValue;
  branded?: boolean;
}) {
  const { addToCart, cart, removeToCart } = useCartStore();
  return (
    <div
      className={cn(
        "mt-auto mb-0 flex flex-row gap-4 justify-between items-center w-full",
        containerClassName
      )}
    >
      <CurrencyText
        branded={branded}
        className={cn("flex-1 w-full", textClassName)}
        amount={sheet.sheets.price}
      />
      {cart.find((item) => item.sheets.id === sheet.sheets.id) ? (
        <Button
          onClick={() => removeToCart(sheet)}
          variant="default"
          size="icon"
        >
          <X size={10} />
          <ShoppingCart size={14} />
        </Button>
      ) : (
        <Button onClick={() => addToCart(sheet)} variant="ghost" size="icon">
          <ShoppingCart size={16} />
        </Button>
      )}
    </div>
  );
}
