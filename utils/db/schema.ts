import { SOCIAL_MEDIA_BASE_URLS, SOCIAL_MEDIA_TYPES } from "@/lib/constants";
import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  real,
  serial,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const ArrangersPublicData = pgTable("arrangers_pb_data", {
  id: text("id").primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  avatar_url: text("avatar_url").default("/favicon.ico"),
  bio: text("bio").$defaultFn(() => "Hello! I'm an arranger."),
  social_links: jsonb("social_links")
    .$type<
      Array<{
        value: string;
        type: z.infer<typeof SOCIAL_MEDIA_TYPES>;
        base_url: z.infer<typeof SOCIAL_MEDIA_BASE_URLS>;
      }>
    >()
    .$defaultFn(() => []),
  genres: text("genres")
    .array()
    .$defaultFn(() => []),
  instruments: text("instruments")
    .array()
    .$defaultFn(() => []),
  slug: text("slug").notNull(),
});

export const Sheets = pgTable("sheets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  arranger_id: text("arranger_id").references(() => ArrangersPublicData.id, {
    onDelete: "no action",
  }),
  title: text("title").notNull(),
  og_artists: text("og_artists").array().notNull(),
  thumbnail_url: text("thumbnail_url").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  instruments_used: text("instruments_used")
    .array()
    .$defaultFn(() => []),
  difficulty: text("difficulty")
    .$type<"Beginner" | "Intermediate" | "Advanced">()
    .$defaultFn(() => "Beginner"),
  genres: text("genres")
    .array()
    .$defaultFn(() => []),
  price: real("price").notNull().default(5),
});

export const SheetsFileURL = pgTable("sheets_file_url", {
  url: text("url").primaryKey().notNull(),
  sheet_id: integer("sheet_id").references(() => Sheets.id, {
    onDelete: "cascade",
  }),
});

export const Transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  payment_intent_id: text("payment_intent_id").notNull(),
  metadata: jsonb("metadata")
    .$type<
      Array<{
        id: number;
        price: number;
      }>
    >()
    .notNull(),
  price: real("price").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  status: text("status")
    .$type<"pending" | "succeeded" | "failed">()
    .notNull()
    .$defaultFn(() => "pending"),
  user_id: text("user_id"),
});

export const Library = pgTable("library", {
  id: serial("id").primaryKey(),
  sheet: integer("sheet").references(() => Sheets.id, {
    onDelete: "cascade",
  }),
  payment_intent: text("payment_intent").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  user_id: text("user_id"),
});

export const Sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  sheet: integer("sheet").references(() => Sheets.id, {
    onDelete: "no action",
  }),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  payment_intent: text("payment_intent"),
  buyer_id: text("buyer_id"),
  arranger_id: text("arranger_id").references(() => ArrangersPublicData.id, {
    onDelete: "no action",
  }),
});

// Relations
export const sheetsRelations = relations(Sheets, ({ one, many }) => ({
  arranger: one(ArrangersPublicData, {
    fields: [Sheets.arranger_id],
    references: [ArrangersPublicData.id],
    relationName: "sheet_arranger",
  }),
  fileUrl: one(SheetsFileURL, {
    fields: [Sheets.id],
    references: [SheetsFileURL.sheet_id],
    relationName: "sheet_pdf",
  }),
  transaction: many(Transactions, { relationName: "sheet_transaction" }),
  library: many(Library, { relationName: "sheet_library" }),
  sale: many(Sales, { relationName: "sheet_sale" }),
}));

export const arrangersPublicDataRelations = relations(
  ArrangersPublicData,
  ({ many }) => ({
    sheet: many(Sheets, { relationName: "sheet_arranger" }),
    sale: many(Sales, { relationName: "arranger_sale" }),
  })
);

export const sheetsFileURLRelations = relations(SheetsFileURL, ({ one }) => ({
  sheet: one(Sheets, {
    fields: [SheetsFileURL.sheet_id],
    references: [Sheets.id],
    relationName: "sheet_pdf",
  }),
}));

export const transactionsRelations = relations(Transactions, ({ many }) => ({
  sheet: many(Sheets, { relationName: "sheet_transaction" }),
  library: many(Library, { relationName: "transaction_library" }),
}));

export const libraryRelations = relations(Library, ({ one }) => ({
  sheet: one(Sheets, {
    fields: [Library.sheet],
    references: [Sheets.id],
    relationName: "sheet_library",
  }),
  transaction: one(Transactions, {
    fields: [Library.payment_intent],
    references: [Transactions.payment_intent_id],
    relationName: "transaction_library",
  }),
}));

export const salesRelations = relations(Sales, ({ one }) => ({
  sheet: one(Sheets, {
    fields: [Sales.sheet],
    references: [Sheets.id],
    relationName: "sheet_sale",
  }),
  arranger: one(ArrangersPublicData, {
    fields: [Sales.arranger_id],
    references: [ArrangersPublicData.id],
    relationName: "arranger_sale",
  }),
}));
