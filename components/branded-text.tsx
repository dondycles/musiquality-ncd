import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export default function BrandedText({
  text,
  className,
  useH1,
}: {
  text: string;
  className?: ClassNameValue;
  useH1?: boolean;
}) {
  if (useH1)
    return (
      <h1
        className={cn(
          "font-cormorant font-semibold text-2xl sm:text-3xl md:text-4xl",
          className
        )}
      >
        {text}
      </h1>
    );
  return (
    <span
      className={cn(
        "font-cormorant font-semibold text-2xl sm:text-3xl md:text-4xl",
        className
      )}
    >
      {text}
    </span>
  );
}
