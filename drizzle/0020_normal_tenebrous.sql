CREATE TABLE IF NOT EXISTS "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"sheet" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"payment_intent" text NOT NULL,
	"buyer_id" text NOT NULL,
	"arranger_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_sheet_sheets_id_fk" FOREIGN KEY ("sheet") REFERENCES "public"."sheets"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_payment_intent_transactions_payment_intent_id_fk" FOREIGN KEY ("payment_intent") REFERENCES "public"."transactions"("payment_intent_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_arranger_id_arrangers_pb_data_id_fk" FOREIGN KEY ("arranger_id") REFERENCES "public"."arrangers_pb_data"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
