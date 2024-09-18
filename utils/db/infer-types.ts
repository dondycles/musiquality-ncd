import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "./schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type CurrentArrangerSales = InferResultType<
  "Sales",
  {
    sheet: {
      with: {
        fileUrl: true;
        arranger: true;
      };
    };
  }
>;

export type CurrentUserTransactions = InferResultType<
  "Transactions",
  {
    library: {
      with: {
        sheet: {
          with: {
            fileUrl: true;
            arranger: true;
          };
        };
      };
    };
  }
>;

export type CurrentArrangerData = InferResultType<
  "ArrangersPublicData",
  {
    sheet: {
      with: {
        fileUrl: true;
        arranger: true;
      };
    };
    sale: {
      with: {
        sheet: {
          with: {
            fileUrl: true;
            arranger: true;
          };
        };
      };
    };
  }
>;

export type CurrentUserWholeData = {
  userTransactions: CurrentUserTransactions[] | null;
  arrangerData: CurrentArrangerData | null;
  error: string | null;
};
