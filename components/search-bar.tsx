"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Loader } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash-es/debounce";

export default function SearchBar({ baseUrl }: { baseUrl: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("term") || ""
  );

  useEffect(() => {
    if (searchParams.get("term") === "") return setIsSearching(false);
    if (searchParams.get("term")) return setIsSearching(false);
  }, [searchParams]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setIsSearching(true);
      router.push(baseUrl + "?term=" + term);
    }, 500),
    [router, baseUrl]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isSearching) return;
        setIsSearching(true);
        router.push(baseUrl + "?term=" + searchValue);
      }}
      className="flex flex-row gap-2 items-center"
    >
      <Input
        name="term"
        className={`shadow-none ${isSearching && "animate-pulse"}`}
        placeholder="Search for piece/artist/arranger"
        value={searchValue}
        onChange={handleInputChange}
      />
      {isSearching && (
        <Loader size={16} className="animate-spin text-muted-foreground" />
      )}
    </form>
  );
}
