"use client";

import CurrencyText from "@/components/currency-text";
import { ArrangersPublicData, Sales, Sheets } from "@/utils/db/schema";

export default function ArrangerCenterSale({
  sales,
}: {
  sales:
    | {
        sheets: typeof Sheets.$inferSelect;
        arrangers_pb_data: typeof ArrangersPublicData.$inferSelect;
        sales: typeof Sales.$inferSelect;
      }[]
    | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col border rounded-md p-4 w-fit">
        <p className="text-muted-foreground text-xs">Total Sales: </p>
        <CurrencyText
          amount={sales?.reduce((acc, s) => acc + s.sheets.price, 0) ?? 0}
        />
      </div>

      {sales?.map((s) => {
        return <div key={s.sales.id}>{s.sheets.title}</div>;
      })}
    </div>
  );
}
