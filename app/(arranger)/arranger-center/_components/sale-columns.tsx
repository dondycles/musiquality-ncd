import CurrencyText from "@/components/currency-text";
import { Sale } from "@/components/providers/user-data-provider";
import { ColumnDef } from "@tanstack/react-table";
export const saleColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: "sales_created_at",
    header: "Date",
    cell: ({ row }) => {
      return (
        <p className="capitalize text-xs">
          {new Date(row.original.sales.created_at).toLocaleString()}
        </p>
      );
    },
  },
  {
    accessorKey: "sheets_title",
    header: "Title",
    cell: ({ row }) => {
      return <p className="capitalize text-xs">{row.original.sheets.title}</p>;
    },
  },
  {
    accessorKey: "sheets_price",
    header: "Price",
    cell: ({ row }) => {
      return (
        <CurrencyText branded={false} amount={row.original.sheets.price} />
      );
    },
  },
  {
    accessorKey: "sales_payment_intent",
    header: "Payment Intent",
    cell: ({ row }) => {
      return (
        <p className="text-xs text-muted-foreground">
          {row.original.sales.payment_intent}
        </p>
      );
    },
  },
];
