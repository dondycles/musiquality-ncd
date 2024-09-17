import CurrencyText from "@/components/currency-text";
import { Transaction, Sale } from "@/components/providers/user-data-provider";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
export const saleColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: "sales.created_at",
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
    accessorKey: "sheets.title",
    header: "Title",
    cell: ({ row }) => {
      return <p className="capitalize text-xs">{row.original.sheets.title}</p>;
    },
  },
  {
    accessorKey: "sheets.price",
    header: "Price",
    cell: ({ row }) => {
      return (
        <CurrencyText branded={false} amount={row.original.sheets.price} />
      );
    },
  },
  {
    accessorKey: "sales.payment_intent",
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
