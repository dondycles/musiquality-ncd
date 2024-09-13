import { SOCIAL_MEDIA_BASE_URLS, SOCIAL_MEDIA_TYPES } from "@/lib/constants";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
});

export const SheetsFileURL = pgTable("sheets_file_url", {
  url: text("url").primaryKey().notNull(),
  sheet_id: integer("sheet_id").references(() => Sheets.id, {
    onDelete: "cascade",
  }),
});
