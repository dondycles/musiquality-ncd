"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InferResultType } from "@/utils/db/infer-types";
import { Star } from "lucide-react";
import { useState } from "react";

export default function RateBtn({
  arranger,
}: {
  arranger: InferResultType<
    "ArrangersPublicData",
    {
      sheet: true;
      followers: true;
    }
  >;
}) {
  const [star, setStar] = useState(0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          Rate <Star size={16} className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onMouseLeave={() => setStar(-1)}
        align="end"
        className="flex flex-row gap-2 w-fit"
      >
        {Array(5)
          .fill(0)
          .map((_, i) => {
            return (
              <Star
                onMouseOver={() => setStar(i)}
                className={`fill-background cursor-pointer duration-300 ${
                  i <= star && "fill-yellow-400 "
                }`}
                size={24}
                key={i}
              />
            );
          })}
      </PopoverContent>
    </Popover>
  );
}
