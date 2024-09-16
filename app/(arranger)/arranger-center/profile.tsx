import ArrangerAvatar from "@/components/arranger.avatar";
import { ArrangersPublicData } from "@/utils/db/schema";
import Link from "next/link";
import { SOCIAL_MEDIAS } from "@/lib/constants";
import ArrangerUpdateForm from "./update-form";

export default function ArrangerCenterProfile({
  arranger_data,
}: {
  arranger_data: typeof ArrangersPublicData.$inferSelect;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-start sm:items-start sm:justify-center">
      <ArrangerAvatar
        className="w-fit rounded-full"
        arranger_data={arranger_data}
      />
      <div className="flex flex-col gap-2 flex-1">
        <div className="text-center sm:text-left">
          <p className="font-semibold">{arranger_data.name}</p>
          <p className="italic whitespace-pre-wrap bg-muted py-2 px-4 rounded-md mt-2 text-center sm:text-left w-full">
            &quot;{arranger_data.bio}&quot;
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>{arranger_data.instruments?.join(", ")}</p>
          <p className="mb-2">
            {arranger_data.genres?.map((g) => g).join(", ")}
          </p>
          {arranger_data.social_links?.map((sl) => {
            return (
              <Link
                key={sl.type}
                href={`${sl.base_url}${sl.value}`}
                className="flex items-center gap-1 hover:underline"
                target="_blank"
              >
                <div className="text-lg">
                  {SOCIAL_MEDIAS.find((sm) => sm.type === sl.type)?.icon}
                </div>
                <p>{sl.value}</p>
              </Link>
            );
          })}
        </div>
        <div className="text-muted-foreground text-xs text-left">
          <p>Slug: /{arranger_data.slug}</p>
          <p>Started at: {arranger_data?.created_at.toLocaleString()}</p>
        </div>
        <ArrangerUpdateForm arranger_data={arranger_data} />
      </div>
    </div>
  );
}
