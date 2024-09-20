ALTER TABLE "arranger_followers" DROP CONSTRAINT "arranger_followers_arranger_id_arrangers_pb_data_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "arranger_followers" ADD CONSTRAINT "arranger_followers_arranger_id_arrangers_pb_data_slug_fk" FOREIGN KEY ("arranger_id") REFERENCES "public"."arrangers_pb_data"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
