"use client";

import { Button } from "@/components/ui/button";
import { User, Plus, Music, LayoutDashboard } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ArrangerCenterNav() {
  const view = useSearchParams().get("view") ?? "dashboard";
  const router = useRouter();
  return (
    <nav className="p-4 border-r flex flex-col gap-4">
      <Button
        onClick={() => {
          router.push("/arranger-center?view=dashboard");
        }}
        size="icon"
        variant={view === "dashboard" ? "default" : "ghost"}
      >
        <LayoutDashboard size={16} />
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
          router.push("/arranger-center?view=profile");
        }}
        size={"icon"}
        variant={view === "profile" ? "default" : "ghost"}
      >
        <User size={16} />
      </Button>
    </nav>
  );
}
