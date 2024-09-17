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
export default function ArrangerCenterEdit() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchParams.get("sheet_id") ?? "");

  const { arrangerData, isLoading } = useContext(UserDataContext);

  const arrangements = arrangerData?.arrangements ?? [];

  const targetedSheet = arrangerData?.arrangements?.find(
    (a) => a.sheets.id === Number(value)
  );
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
              ? arrangements.find((a) => String(a.sheets.id) === value)?.sheets
                  .title
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
                {arrangements.map((a) => (
                  <CommandItem
                    key={a.sheets.id}
                    value={String(a.sheets.id)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {a.sheets.title}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === String(a.sheets.id)
                          ? "opacity-100"
                          : "opacity-0"
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
          key={targetedSheet.sheets.id}
          sheet={targetedSheet}
        />
      )}
    </div>
  );
}
