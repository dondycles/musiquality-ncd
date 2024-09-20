CREATE TABLE IF NOT EXISTS "arranger_followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"arranger_id" text NOT NULL,
	"follower_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arranger_followers" ADD CONSTRAINT "arranger_followers_arranger_id_arrangers_pb_data_id_fk" FOREIGN KEY ("arranger_id") REFERENCES "public"."arrangers_pb_data"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
