import CurrencyText from "@/components/currency-text";
import { Transaction } from "@/components/providers/user-data-provider";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
export const transactionColumns: ColumnDef<
  Transaction["transactions"] | undefined
>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge className="capitalize text-xs">{row.original?.status}</Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return (
        <p className="text-xs text-muted-foreground">
          {new Date(row.original?.created_at ?? "").toLocaleString()}
        </p>
      );
    },
  },

  {
    accessorKey: "payment_intent_id",
    header: "Payment ID",
    cell: ({ row }) => {
      return (
        <p className="text-xs text-muted-foreground">
          {row.original?.payment_intent_id}
        </p>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <CurrencyText
          branded={false}
          amount={(row.original?.price ?? 0) / 100}
          className="text-xs"
        />
      );
    },
  },
  {
    accessorKey: "metadata",
    header: "Metadata",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-muted-foreground">
          {row.original?.metadata.map((m) => (
            <div key={m.id}>
              <Link className="hover:underline" href={`/sheet/${m.id}`}>
                {m.id}
              </Link>{" "}
              - <CurrencyText branded={false} amount={m.price} />
            </div>
          ))}
        </div>
      );
    },
  },
];
