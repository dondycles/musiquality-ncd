CREATE TABLE IF NOT EXISTS "arranger_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"arranger_id" text NOT NULL,
	"rater_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arranger_ratings" ADD CONSTRAINT "arranger_ratings_arranger_id_arrangers_pb_data_slug_fk" FOREIGN KEY ("arranger_id") REFERENCES "public"."arrangers_pb_data"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
