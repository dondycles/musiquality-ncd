"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("term"));
  useEffect(() => {
    if (searchParams.get("term")) return setIsSearching(false);
  }, [searchParams]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isSearching) return;
        setIsSearching(true);
        const formData = new FormData(e.currentTarget);
        const searchTerm = formData.get("term");
        router.push("/search?term=" + searchTerm);
      }}
      className="flex flex-row gap-2 items-center"
    >
      <Input
        name="term"
        className={`shadow-none ${isSearching && "animate-pulse"}`}
        placeholder="Search for piece/artist/arranger"
        value={searchValue ?? ""}
        onInput={(e) => setSearchValue(e.currentTarget.value)}
      />
      {isSearching && (
        <Loader size={16} className="animate-spin text-muted-foreground" />
      )}
    </form>
  );
}
