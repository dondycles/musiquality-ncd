"use client";
import { CurrentArrangerData } from "@/utils/db/infer-types";
import { ArrangementDataTable } from "./arrangement-data-table";
import { arrangementColumns } from "./arrangement-columns";

export default function ArrangerCenterArrangements({
  sheets,
}: {
  sheets: CurrentArrangerData["sheet"];
}) {
  return <ArrangementDataTable columns={arrangementColumns} data={sheets} />;
}
