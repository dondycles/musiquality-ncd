"use client";

import CurrencyText from "@/components/currency-text";
import { SaleDataTable } from "./sale-data-table";
import { saleColumns } from "./sale-columns";
import { CurrentArrangerSales } from "@/utils/db/infer-types";
import BrandedText from "@/components/branded-text";

export default function ArrangerCenterSale({
  sales,
}: {
  sales: CurrentArrangerSales[];
}) {
  const salesUniqueByPaymentIntent = Array.from(
    new Set(sales?.map((sale) => sale.payment_intent))
  ).map((paymentIntentId) => {
    const _sales = sales?.filter(
      (sale) => sale.payment_intent === paymentIntentId
    );
    return {
      id: _sales[0].payment_intent!,
      created_at: _sales[0].created_at,
      sheet: _sales.flatMap((s) => s),
      total: _sales.reduce((acc, s) => acc + (s.sheet?.price || 0), 0),
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col border rounded-md p-4 w-fit">
          <p className="text-muted-foreground text-xs">Total Sales: </p>
          <CurrencyText
            amount={
              sales?.reduce((acc, s) => acc + (s.sheet?.price || 0), 0) || 0
            }
          />
        </div>
        <div className="flex flex-col border rounded-md p-4 w-fit">
          <p className="text-muted-foreground text-xs">Quantity Sold: </p>
          <div className="flex flex-row gap-2 items-center">
            <BrandedText text={`${sales?.length ?? 0} `} />
            <p>Sheets</p>
          </div>
        </div>
      </div>

      <SaleDataTable columns={saleColumns} data={salesUniqueByPaymentIntent} />
    </div>
  );
}
