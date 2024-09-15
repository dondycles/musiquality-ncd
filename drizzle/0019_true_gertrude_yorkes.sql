CREATE TABLE IF NOT EXISTS "library" (
	"id" serial PRIMARY KEY NOT NULL,
	"sheet" integer,
	"payment_intent" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "library" ADD CONSTRAINT "library_sheet_sheets_id_fk" FOREIGN KEY ("sheet") REFERENCES "public"."sheets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "library" ADD CONSTRAINT "library_payment_intent_transactions_payment_intent_id_fk" FOREIGN KEY ("payment_intent") REFERENCES "public"."transactions"("payment_intent_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
