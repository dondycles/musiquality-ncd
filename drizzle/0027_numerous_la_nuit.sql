ALTER TABLE "arranger_ratings" RENAME COLUMN "arranger_id" TO "arranger_slug";--> statement-breakpoint
ALTER TABLE "arranger_followers" DROP CONSTRAINT "arranger_followers_arranger_id_arrangers_pb_data_slug_fk";
--> statement-breakpoint
ALTER TABLE "arranger_ratings" DROP CONSTRAINT "arranger_ratings_arranger_id_arrangers_pb_data_slug_fk";
--> statement-breakpoint
ALTER TABLE "arranger_followers" ADD COLUMN "arranger_slug" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arranger_followers" ADD CONSTRAINT "arranger_followers_arranger_slug_arrangers_pb_data_slug_fk" FOREIGN KEY ("arranger_slug") REFERENCES "public"."arrangers_pb_data"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arranger_ratings" ADD CONSTRAINT "arranger_ratings_arranger_slug_arrangers_pb_data_slug_fk" FOREIGN KEY ("arranger_slug") REFERENCES "public"."arrangers_pb_data"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "arranger_followers" DROP COLUMN IF EXISTS "arranger_id";