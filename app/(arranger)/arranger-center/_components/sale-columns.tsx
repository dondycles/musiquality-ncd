import CurrencyText from "@/components/currency-text";
import { CurrentArrangerSales } from "@/utils/db/infer-types";
import { ColumnDef } from "@tanstack/react-table";
export const saleColumns: ColumnDef<{
  sheet: Array<Pick<CurrentArrangerSales, "sheet">>;
  id: string;
  created_at: Date;
  total: number;
}>[] = [
  {
    accessorKey: "sales_created_at",
    header: "Date",
    cell: ({ row }) => {
      return (
        <p className="capitalize text-xs">
          {new Date(row.original.created_at).toLocaleString()}
        </p>
      );
    },
  },
  {
    accessorKey: "sheets_title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <p className="capitalize text-xs line-clamp-2">
          {row.original.sheet.flatMap((s) => s?.sheet?.title).join(", ")}
        </p>
      );
    },
  },
  {
    accessorKey: "sheets_price",
    header: "Price",
    cell: ({ row }) => {
      return <CurrencyText branded={false} amount={row.original.total || 0} />;
    },
  },
  {
    accessorKey: "sales_payment_intent",
    header: "Payment Intent",
    cell: ({ row }) => {
      return <p className="text-xs text-muted-foreground">{row.original.id}</p>;
    },
  },
];
