CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_intent_id" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"price" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text NOT NULL
);
