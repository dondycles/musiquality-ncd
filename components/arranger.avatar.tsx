import Image from "next/image";
import Link from "next/link";
import { ArrangersPublicData } from "@/utils/db/schema";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
export default function ArrangerAvatar({
  arranger_data,
  size = 256,
  className,
}: {
  arranger_data: typeof ArrangersPublicData.$inferSelect;
  size?: number;
  className?: ClassNameValue;
}) {
  return (
    <Link
      href={`/arranger/${arranger_data.slug}`}
      className={cn("shrink-0", className)}
    >
      <Image
        placeholder="blur"
        blurDataURL={
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIj48L2NpcmNsZT48cGF0aCBkPSJNMTIgNnYyIj48L3BhdGg+PC9zdmc+"
        }
        src={arranger_data.avatar_url ?? "/favicon.ico"}
        alt={arranger_data.name}
        className="rounded-full aspect-square object-contain shrink-0 hover:brightness-50 duration-300"
        width={size}
        height={size}
        priority
        quality={100}
      />
    </Link>
  );
}
