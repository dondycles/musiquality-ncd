"use client";

import { Button } from "@/components/ui/button";
import { User, Plus, ChartSpline, Music, Pencil } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ArrangerCenterNav() {
  const view = useSearchParams().get("view") ?? "profile";
  const router = useRouter();
  return (
    <nav className="p-4 border-r flex flex-col gap-4">
      <Button
        onClick={() => {
          router.push("/arranger-center?view=profile");
        }}
        size={"icon"}
        variant={view === "profile" ? "default" : "ghost"}
      >
        <User size={16} />
      </Button>
      <Button
        onClick={() => {
          router.push("/arranger-center?view=new");
        }}
        size="icon"
        variant={view === "new" ? "default" : "ghost"}
      >
        <Plus size={16} />
      </Button>
      <Button
        onClick={() => {
          router.push("/arranger-center?view=sales");
        }}
        size="icon"
        variant={view === "sales" ? "default" : "ghost"}
      >
        <ChartSpline size={16} />
      </Button>
      <Button
        onClick={() => {
          router.push("/arranger-center?view=arrangements");
        }}
        size="icon"
        variant={
          view === "arrangements" || view === "edit" ? "default" : "ghost"
        }
      >
        <Music size={16} />
      </Button>
    </nav>
  );
}
