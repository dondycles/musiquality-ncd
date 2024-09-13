CREATE TABLE IF NOT EXISTS "arrangers_pb_data" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sheets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sheets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"arranger_id" text,
	"title" text NOT NULL,
	"og_artists" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sheets_file_url" (
	"url" text PRIMARY KEY NOT NULL,
	"sheet_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_messages" (
	"user_id" text PRIMARY KEY NOT NULL,
	"create_ts" timestamp DEFAULT now() NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_pb_data" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"is_arranger" boolean NOT NULL,
	"arranger_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sheets" ADD CONSTRAINT "sheets_arranger_id_arrangers_pb_data_id_fk" FOREIGN KEY ("arranger_id") REFERENCES "public"."arrangers_pb_data"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sheets_file_url" ADD CONSTRAINT "sheets_file_url_sheet_id_sheets_id_fk" FOREIGN KEY ("sheet_id") REFERENCES "public"."sheets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_pb_data" ADD CONSTRAINT "users_pb_data_arranger_id_arrangers_pb_data_id_fk" FOREIGN KEY ("arranger_id") REFERENCES "public"."arrangers_pb_data"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
