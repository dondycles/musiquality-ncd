"use client";

import { UserDataContext } from "@/components/providers/user-data-provider";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import ArrangerEditSheetForm from "./edit-sheet-form";
import { CurrentArrangerData } from "@/utils/db/infer-types";
export default function ArrangerCenterEdit({
  sheets,
}: {
  sheets: CurrentArrangerData["sheet"];
}) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchParams.get("sheet_id") ?? "");

  const targetedSheet = sheets?.find((a) => a.id === Number(value));
  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {value
              ? sheets.find((a) => String(a.id) === value)?.title
              : "Select arrangement..."}
            <Search size={16} className="ml-1 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
          <Command>
            <CommandInput placeholder="Search arrangement..." className="h-9" />
            <CommandList>
              <CommandEmpty>No arrangement found.</CommandEmpty>
              <CommandGroup>
                {sheets.map((a) => (
                  <CommandItem
                    key={a.id}
                    value={String(a.id)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {a.title}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === String(a.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {targetedSheet && (
        <ArrangerEditSheetForm
          key={targetedSheet.id}
          sheet={{
            sheets: targetedSheet,
            sheets_file_url: targetedSheet.fileUrl,
          }}
        />
      )}
    </div>
  );
}
