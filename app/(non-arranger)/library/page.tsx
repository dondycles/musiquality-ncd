import { currentUser } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";
import LibraryClientPage from "./_components/client";
export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  const user = await currentUser();

  if (!user) return <RedirectToSignIn />;

  return <LibraryClientPage searchParams={searchParams} />;
}
