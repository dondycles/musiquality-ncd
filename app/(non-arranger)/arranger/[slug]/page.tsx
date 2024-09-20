import ArrangerAvatar from "@/components/arranger.avatar";
import BrandedText from "@/components/branded-text";
import {
  SheetsDisplayer,
  SheetsDisplayerContent,
  SheetsDisplayerHeader,
  SheetsDisplayerIcon,
  SheetsDisplayerTitle,
  SheetsDisplayerViewToggleBtn,
} from "@/components/sheets/sheets-displayer";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { ArrangersPublicData, Sheets } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { Music, Star } from "lucide-react";
import FollowBtn from "./follow-btn";
import { Badge } from "@/components/ui/badge";
import RateBtn from "./rate-btn";

export default async function ArrangerPage({
  params,
}: {
  params: { slug: string };
}) {
  const arranger = await db.query.ArrangersPublicData.findFirst({
    with: {
      sheet: true,
      followers: true,
    },
    where: eq(ArrangersPublicData.slug, params.slug),
  });

  if (arranger)
    return (
      <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <ArrangerAvatar size={96} arranger_data={arranger} />
          <div className="flex flex-col gap-2 w-fit items-center sm:items-start sm:text-left text-center flex-1">
            <BrandedText text={arranger.name} />
            <Badge variant={"secondary"} className="text-xs w-fit">
              {arranger.followers.length ?? 0} Followers
            </Badge>
            <p className="text-muted-foreground text-sm">
              {arranger.bio} Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quibusdam repudiandae molestias praesentium. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Vel at dolorum
              explicabo.
            </p>
          </div>
          <div className="flex sm:flex-col flex-row gap-4 justify-center">
            <FollowBtn arranger={arranger} />
            <RateBtn arranger={arranger} />
          </div>
        </div>
        <SheetsDisplayer>
          <SheetsDisplayerHeader>
            <SheetsDisplayerIcon>
              <Music size={24} />
            </SheetsDisplayerIcon>
            <SheetsDisplayerTitle>
              Arrangements{" "}
              <span className="text-muted-foreground text-xs font-normal">
                ({arranger.sheet.length})
              </span>
            </SheetsDisplayerTitle>
            <SheetsDisplayerViewToggleBtn actionType="top-selling" />
          </SheetsDisplayerHeader>
          <SheetsDisplayerContent
            actionType="top-selling"
            sheets={
              arranger.sheet.map((s) => ({
                sheets_file_url: null,
                arrangers_pb_data: arranger,
                sheets: s,
              }))!
            }
          />
        </SheetsDisplayer>
      </div>
    );
}
