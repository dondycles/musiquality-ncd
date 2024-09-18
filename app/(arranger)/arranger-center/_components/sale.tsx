"use client";

import CurrencyText from "@/components/currency-text";
import { DataTable } from "./sale-data-table";
import { saleColumns } from "./sale-columns";
import { CurrentArrangerSales } from "@/utils/db/infer-types";

export default function ArrangerCenterSale({
  sales,
}: {
  sales: CurrentArrangerSales[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col border rounded-md p-4 w-fit">
        <p className="text-muted-foreground text-xs">Total Sales: </p>
        <CurrencyText
          amount={
            sales?.reduce((acc, s) => acc + (s.sheet?.price || 0), 0) || 0
          }
        />
      </div>
      <DataTable
        columns={saleColumns}
        data={
          sales?.toSorted(
            (a, b) => b.created_at.getTime() - a.created_at.getTime()
          ) ?? []
        }
      />
    </div>
  );
}
