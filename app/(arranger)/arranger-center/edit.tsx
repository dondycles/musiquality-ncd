"use client";

import { useSearchParams } from "next/navigation";

export default function ArrangerCenterEdit() {
  const searchParams = useSearchParams();
  const sheet_id = searchParams.get("sheet_id");
  return <div>ArrangerCenterEdit {sheet_id}</div>;
}
