import { currentUser } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";
import LibraryClientPage from "./client";
export default async function LibraryPage() {
  const user = await currentUser();

  if (!user) return <RedirectToSignIn />;

  return <LibraryClientPage />;
}
