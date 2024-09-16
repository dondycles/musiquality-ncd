import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ArrangerCenterView from "./view";

export default async function ArrangerCenterPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();
  if (!user) return <RedirectToSignIn />;
  if (!user.publicMetadata.is_arranger) return redirect("/apply-as-arranger");

  return (
    <div className="flex flex-col gap-4 flex-1 x-padding py-4 overflow-y-auto">
      <h1 className="text-muted-foreground text-sm capitalize">
        Arranger Center / {searchParams.view}
      </h1>
      <ArrangerCenterView />
    </div>
  );
}
