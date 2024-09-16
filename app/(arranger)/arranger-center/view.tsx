"use client";

import { useSearchParams } from "next/navigation";
import ArrangerCenterProfile from "./profile";
import ArrangerUploadSheetForm from "./upload-sheet-form";
import ArrangerCenterSale from "./sale";
import ArrangerCenterEdit from "./edit";
import ArrangerCenterArrangements from "./arrangements";
import { useContext } from "react";
import { UserDataContext } from "@/components/user-data-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArrangerCenterView() {
  const view = useSearchParams().get("view") ?? "profile";
  const { arrangerData, isLoading } = useContext(UserDataContext);

  if (isLoading) return <div>Loading...</div>;
  if (!arrangerData?.arrangerData)
    return (
      <div className="flex flex-col gap-4 mt-[70px] flex-1 items-center justify-center  py-4">
        <p className="text-muted-foreground">You are not an Arranger</p>
        <Link href="/apply-as-arranger">
          <Button>Apply as Arranger</Button>
        </Link>
      </div>
    );

  if (view === "profile") {
    return <ArrangerCenterProfile arranger_data={arrangerData.arrangerData} />;
  }
  if (view === "new") {
    return <ArrangerUploadSheetForm />;
  }
  if (view === "sales") {
    return <ArrangerCenterSale sales={arrangerData.sales} />;
  }
  if (view === "arrangements") {
    return <ArrangerCenterArrangements />;
  }
  if (view === "edit") {
    return <ArrangerCenterEdit />;
  }
  return null;
}
