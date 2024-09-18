"use client";

import { useSearchParams } from "next/navigation";
import ArrangerCenterProfile from "./profile";
import ArrangerUploadSheetForm from "./upload-sheet-form";
import ArrangerCenterSale from "./sale";
import ArrangerCenterEdit from "./edit";
import ArrangerCenterArrangements from "./arrangements";
import { useContext } from "react";
import { UserDataContext } from "@/components/providers/user-data-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import ArrangerCenterDashboard from "./dashboard";

export default function ArrangerCenterView() {
  const view = useSearchParams().get("view") ?? "dashboard";
  const { arrangerData, isLoading } = useContext(UserDataContext);

  const sales = arrangerData?.sale ?? [];
  const sheets = arrangerData?.sheet ?? [];

  if (isLoading)
    return (
      <div>
        <Loader size={16} className="animate-spin mx-auto" />
      </div>
    );
  if (!arrangerData)
    return (
      <div className="flex flex-col gap-4 mt-[70px] flex-1 items-center justify-center  py-4">
        <p className="text-muted-foreground">You are not an Arranger</p>
        <Link href="/apply-as-arranger">
          <Button>Apply as Arranger</Button>
        </Link>
      </div>
    );

  if (view === "profile") {
    return <ArrangerCenterProfile arranger_data={arrangerData} />;
  }
  if (view === "new") {
    return <ArrangerUploadSheetForm />;
  }
  if (view === "dashboard") {
    return (
      <ArrangerCenterDashboard>
        <ArrangerCenterSale sales={sales} />
        <ArrangerCenterArrangements sheets={sheets} />
      </ArrangerCenterDashboard>
    );
  }
  if (view === "edit") {
    return <ArrangerCenterEdit sheets={sheets} />;
  }
  return null;
}
