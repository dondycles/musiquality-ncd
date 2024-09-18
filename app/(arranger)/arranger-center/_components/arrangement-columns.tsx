import CurrencyText from "@/components/currency-text";
import { Button } from "@/components/ui/button";
import { CurrentArrangerData } from "@/utils/db/infer-types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronsDown,
  ChevronsUp,
  ChevronsUpDown,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
export const arrangementColumns: ColumnDef<CurrentArrangerData["sheet"][0]>[] =
  [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            {column.getIsSorted() === "asc" ? (
              <ChevronsUp className="ml-1" size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronsDown className="ml-1" size={14} />
            ) : (
              <ChevronsUpDown className="ml-1" size={14} />
            )}
          </button>
        );
      },
      cell: ({ row }) => {
        return <p className="capitalize text-xs">{row.original.title}</p>;
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            {column.getIsSorted() === "asc" ? (
              <ChevronsUp className="ml-1" size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronsDown className="ml-1" size={14} />
            ) : (
              <ChevronsUpDown className="ml-1" size={14} />
            )}
          </button>
        );
      },
      cell: ({ row }) => {
        return (
          <CurrencyText branded={false} amount={row.original.price || 0} />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            {column.getIsSorted() === "asc" ? (
              <ChevronsUp className="ml-1" size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronsDown className="ml-1" size={14} />
            ) : (
              <ChevronsUpDown className="ml-1" size={14} />
            )}
          </button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-xs">
            {new Date(row.original.created_at).toLocaleString()}
          </p>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/arranger-center?view=edit&sheet_id=${row.original.id}`}
            >
              <Button size="icon" variant="ghost">
                <Pencil size={16} />
              </Button>
            </Link>
            <Button size="icon" variant="ghost">
              <Trash size={16} />
            </Button>
          </div>
        );
      },
    },
  ];
