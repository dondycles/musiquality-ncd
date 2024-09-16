import { ArrangersPublicData, Sheets, SheetsFileURL } from "./schema";

export type SheetData = {
  sheets: typeof Sheets.$inferSelect;
} & {
  arrangers_pb_data: typeof ArrangersPublicData.$inferSelect;
} & { sheets_file_url: typeof SheetsFileURL.$inferSelect | null };
