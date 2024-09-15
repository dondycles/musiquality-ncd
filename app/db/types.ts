import { ArrangersPublicData, Sheets, SheetsFileURL } from "./schema";

export type PublicSheetData = {
  sheets: typeof Sheets.$inferSelect;
} & {
  arrangers_pb_data: typeof ArrangersPublicData.$inferSelect;
};

export type PrivateSheetData = {
  sheets: typeof Sheets.$inferSelect;
} & {
  arrangers_pb_data: typeof ArrangersPublicData.$inferSelect;
} & { sheets_file_url: typeof SheetsFileURL.$inferSelect };
