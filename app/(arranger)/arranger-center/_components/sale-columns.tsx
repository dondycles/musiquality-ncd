import CurrencyText from "@/components/currency-text";
import { Transaction, Sale } from "@/components/providers/user-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
export const saleColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: "sales_created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown size={16} className="ml-1" />
        </Button>
      );
    },
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
