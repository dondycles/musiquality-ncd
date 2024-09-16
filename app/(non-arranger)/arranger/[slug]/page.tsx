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
import { Music, Star, UserPlus } from "lucide-react";

export default async function ArrangerPage({
  params,
}: {
  params: { slug: string };
}) {
  const arranger = await db
    .select()
    .from(ArrangersPublicData)
    .innerJoin(Sheets, eq(Sheets.arranger_id, ArrangersPublicData.id))
    .where(eq(ArrangersPublicData.slug, params.slug));

  return (
    <div className="flex flex-col gap-4 mt-[70px] flex-1 py-4 x-padding">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        <ArrangerAvatar
          size={96}
          arranger_data={arranger[0].arrangers_pb_data}
        />
        <div className="flex flex-col gap-2 w-fit sm:text-left text-center flex-1">
          <BrandedText text={arranger[0].arrangers_pb_data.name} />
          <p className="text-muted-foreground text-sm">
            {arranger[0].arrangers_pb_data.bio}
          </p>
        </div>
        <div className="flex sm:flex-col flex-row gap-4 justify-center">
          <Button>
            Follow <UserPlus size={16} className="ml-1" />
          </Button>
          <Button>
            Rate <Star size={16} className="ml-1" />
          </Button>
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
              ({arranger.length})
            </span>
          </SheetsDisplayerTitle>
          <SheetsDisplayerViewToggleBtn actionType="top-selling" />
        </SheetsDisplayerHeader>
        <SheetsDisplayerContent
          actionType="top-selling"
          sheets={arranger.map((s) => ({
            ...s,
            sheets_file_url: null,
          }))}
        />
      </SheetsDisplayer>
    </div>
  );
}
