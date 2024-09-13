import SearchBar from "@/components/search-bar";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding ">
      <Suspense>
        <SearchBar />
      </Suspense>
    </div>
  );
}
