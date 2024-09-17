"use client";

import CurrencyText from "@/components/currency-text";
import { ArrangersPublicData, Sales, Sheets } from "@/utils/db/schema";
import { DataTable } from "./sale-data-table";
import { saleColumns } from "./sale-columns";

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
      <DataTable
        columns={saleColumns}
        data={
          sales?.toSorted(
            (a, b) =>
              b.sales.created_at.getTime() - a.sales.created_at.getTime()
          ) ?? []
        }
      />
    </div>
  );
}
