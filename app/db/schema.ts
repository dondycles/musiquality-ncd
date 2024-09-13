import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const ArrangersPublicData = pgTable("arrangers_pb_data", {
  id: text("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  name: text("name").notNull(),
  avatar_url: text("avatar_url").default("/favicon.ico"),
  bio: text("bio").$defaultFn(() => "Hello! I'm an arranger."),
  social_links: jsonb("social_links")
    .$type<
      Array<{
        slug: string;
        type:
          | "facebook"
          | "instagram"
          | "x"
          | "youtube"
          | "spotify"
          | "apple_music";
        base_url:
          | "https://open.spotify.com/artist/"
          | "https://music.apple.com/us/artist/"
          | "https://www.youtube.com/@"
          | "https://www.facebook.com/"
          | "https://www.instagram.com/"
          | "https://www.x.com/";
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
});

export const SheetsFileURL = pgTable("sheets_file_url", {
  url: text("url").primaryKey().notNull(),
  sheet_id: integer("sheet_id").references(() => Sheets.id, {
    onDelete: "cascade",
  }),
});
